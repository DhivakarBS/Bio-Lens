from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import traceback

# support both direct module context and package context
try:
    from extractor import extract_diatoms
    from classifier import DiatomClassifier
except ImportError:
    from ml_service.extractor import extract_diatoms
    from ml_service.classifier import DiatomClassifier

app = FastAPI(title="BioLens ML Service")

# CORS for frontend/backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # later replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# load YOLO once
MODEL_PATH = os.path.join(os.path.dirname(__file__), "best.pt")
classifier = DiatomClassifier(MODEL_PATH)


@app.get("/")
def home():
    return {"message": "BioLens ML Service Running 🚀"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Full BioLens pipeline:
    upload image -> extract diatoms -> classify -> final JSON
    """

    temp_input = "temp_uploaded_image.png"

    if file is None or not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    try:
        with open(temp_input, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print(f"[ml_service] /predict received file: {file.filename}, saved as {temp_input}")

        extract_result = extract_diatoms(temp_input)
        if not isinstance(extract_result, tuple) or len(extract_result) != 2:
            raise RuntimeError("extract_diatoms should return (folder_path, count)")

        extracted_folder, count = extract_result
        print(f"[ml_service] extraction result: folder={extracted_folder}, count={count}")

        if not os.path.isdir(extracted_folder):
            raise RuntimeError(f"Extracted folder not found: {extracted_folder}")

        classification_result = classifier.classify_folder(extracted_folder)
        print(f"[ml_service] classification_result: {classification_result}")

        if not isinstance(classification_result, dict):
            raise RuntimeError("Classifier must return a JSON-serializable dict")

        response_payload = {
            "success": True,
            "totalDiatoms": int(classification_result.get("totalDiatoms", 0)),
            "speciesBreakdown": classification_result.get("speciesBreakdown", {}),
            "confidenceScores": classification_result.get("confidenceScores", {}),
            "waterQualityIndex": float(classification_result.get("waterQualityIndex", 0)),
            "verdict": str(classification_result.get("verdict", "NO DATA")),
            "recordId": None,
            "timestamp": None,
        }

        print(f"[ml_service] /predict response: {response_payload}")
        return response_payload

    except HTTPException:
        raise
    except Exception as err:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction failed: {err}")

    finally:
        if os.path.exists(temp_input):
            os.remove(temp_input)
        try:
            if 'extracted_folder' in locals() and os.path.isdir(extracted_folder):
                shutil.rmtree(extracted_folder, ignore_errors=True)
        except Exception:
            pass
