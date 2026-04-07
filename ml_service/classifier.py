import os
from ultralytics import YOLO



TOLERANCE_SCORES = {
    "Achnanthes": 1, "Brachysira": 1, "Nitzschia": 1, "Cocconeis": 1, "Cymbella": 1, 
    "Cymbopleura": 1, "Encyonema": 1, "Hannaea": 1, "Karayevia": 1, 
    "Meridion": 1, "Planothidium": 1, "Psammothidium": 1, "Stauroneis": 1, 
    "Tabellaria": 1,

    "Achnanthidium": 2, "Adlafia": 2, "Ctenophora": 2, "Diploneis": 2, 
    "Encyonopsis": 2, "Eunotia": 2, "Fallacia": 2, "Frustulia": 2, 
    "Geissleria": 2, "Gomphosphenia": 2, "Gyrosigilla": 2, "Lemnicola": 2, 
    "Pinnularia": 2, "Platessa": 2, "Rossithidium": 2, "Ulnaria": 2,

    "Asterionella": 3, "Aulacoseira": 3, "Cyclotella": 3, "Diadesmis": 3, 
    "Diatoma": 3, "Fragilaria": 3, "Hippodonta": 3, "Melosira": 3, 
    "Navicula": 3, "Neidium": 3, "Placoneis": 3, "Pleurosigma": 3, 
    "Puncticulata": 3, "Reimeria": 3, "Staurosira": 3, "Surirella": 3,

    "Amphora": 4, "Bacillariopsis": 4, "Cymatopleura": 4, "Denticula": 4, 
    "Discostella": 4, "Gomphonema": 4, "Hantzschia": 4, "Luticola": 4, 
    "Mayamaia": 4, "Rhoicosphenia": 4, "Rhopalodia": 4, "Stephanodiscus": 4, 
    "Tryblionella": 4,

    "Craticula": 5, "Eolimna": 5, "Fistulifera": 5,  
    "Sellaphora": 5,

    "Unknown": 3,
    "Other": 3
}

# Note: This dictionary is used by the classificationController.js 
# and main.py to calculate the final Water Quality Index (WQI).


class DiatomClassifier:
    def __init__(self, model_path=None):
        if model_path is None:
            model_path = os.path.join(os.path.dirname(__file__), "best.pt")

        if not os.path.isfile(model_path):
            raise FileNotFoundError(f"YOLO model not found at {model_path}")

        self.model = YOLO(model_path)

    def classify_folder(self, extracted_folder):
        if not os.path.isdir(extracted_folder):
            raise FileNotFoundError(f"Extracted folder not found: {extracted_folder}")

        class_counts = {}
        confidence_accum = {}

        # scan extracted diatom images
        for filename in os.listdir(extracted_folder):
            if not filename.lower().endswith((".png", ".jpg", ".jpeg")):
                continue

            img_path = os.path.join(extracted_folder, filename)

            try:
                results = self.model.predict(img_path, verbose=False)
            except Exception:
                # skip images that fail prediction
                continue

            if not results:
                continue

            prediction = results[0]

            # YOLO detection model: boxes may contain many objects
            if hasattr(prediction, "boxes") and prediction.boxes is not None and len(prediction.boxes) > 0:
                for box in prediction.boxes:
                    try:
                        class_idx = int(box.cls)
                        confidence_value = float(box.conf)
                    except Exception:
                        continue

                    class_name = "Unknown"
                    if isinstance(self.model.names, dict):
                        class_name = self.model.names.get(class_idx, "Unknown")
                    else:
                        try:
                            class_name = self.model.names[class_idx]
                        except Exception:
                            class_name = "Unknown"

                    class_counts[class_name] = class_counts.get(class_name, 0) + 1
                    confidence_accum.setdefault(class_name, []).append(confidence_value)

            # YOLO classification model (single-label)
            elif hasattr(prediction, "probs") and prediction.probs is not None:
                top_idx = prediction.probs.top1
                top_conf = prediction.probs.top1conf

                if top_idx is None or top_conf is None:
                    continue

                try:
                    class_idx = int(top_idx)
                except Exception:
                    continue

                class_name = "Unknown"
                if isinstance(self.model.names, dict):
                    class_name = self.model.names.get(class_idx, "Unknown")
                else:
                    try:
                        class_name = self.model.names[class_idx]
                    except Exception:
                        class_name = "Unknown"

                confidence_value = float(top_conf)

                class_counts[class_name] = class_counts.get(class_name, 0) + 1
                confidence_accum.setdefault(class_name, []).append(confidence_value)

            else:
                # fallback to label from prediction (some API versions)
                try:
                    class_name = str(prediction.names[prediction.boxes.cls[0].astype(int).item()]) if hasattr(prediction, "names") and hasattr(prediction, "boxes") and len(prediction.boxes) > 0 else "Unknown"
                    confidence_value = float(prediction.boxes.conf[0]) if hasattr(prediction, "boxes") and len(prediction.boxes) > 0 else 0.0
                    if class_name != "Unknown":
                        class_counts[class_name] = class_counts.get(class_name, 0) + 1
                        confidence_accum.setdefault(class_name, []).append(confidence_value)
                except Exception:
                    continue

        # if no detected diatoms
        if not class_counts:
            return {
                "totalDiatoms": 0,
                "speciesBreakdown": {"Unknown": 0},
                "confidenceScores": {"Unknown": 0.0},
                "waterQualityIndex": 0,
                "verdict": "UNSAFE",
            }

        total_diatoms = sum(class_counts.values())

        average_confidence_scores = {
            species: round(sum(scores) / len(scores), 4)
            for species, scores in confidence_accum.items()
        }

        overall_confidence = round(
            sum(sum(scores) for scores in confidence_accum.values()) /
            sum(len(scores) for scores in confidence_accum.values()),
            4
        )
        
        # compute WQI via weighted tolerance values
        total_score = 0.0
        for species, count in class_counts.items():
            tolerance = TOLERANCE_SCORES.get(species, 3)
            total_score += tolerance * count

        water_quality_index = round(total_score / total_diatoms, 2) if total_diatoms > 0 else 0

        if water_quality_index <= 2.2:
            verdict = "SAFE"
        elif water_quality_index <= 3.6:
            verdict = "CAUTION"
        else:
            verdict = "UNSAFE"

        return {
            "totalDiatoms": total_diatoms,
            "speciesBreakdown": class_counts,
            "confidenceScores": {
                **average_confidence_scores,
                "overall": overall_confidence
            },
            "waterQualityIndex": water_quality_index,
            "verdict": verdict,
        }