import cv2
import numpy as np
import os


def extract_diatoms(image_path, output_dir="exact_outline_crowd_diatom"):
    if not os.path.isfile(image_path):
        raise FileNotFoundError(f"Input image not found: {image_path}")

    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Could not load image from {image_path}")

    # Ensure output directory exists and is empty
    os.makedirs(output_dir, exist_ok=True)
    for f in os.listdir(output_dir):
        fp = os.path.join(output_dir, f)
        if os.path.isfile(fp):
            os.remove(fp)

    count = 0

    try:
        image_bgra = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        gray_balanced = clahe.apply(gray)

        blurred = cv2.GaussianBlur(gray_balanced, (5, 5), 0)

        thresh = cv2.adaptiveThreshold(
            blurred,
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY_INV,
            11,
            2,
        )

        kernel = np.ones((3, 3), np.uint8)
        cleaned = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=1)
        closed = cv2.morphologyEx(cleaned, cv2.MORPH_CLOSE, kernel, iterations=2)
        separated = cv2.erode(closed, kernel, iterations=1)

        contours, _ = cv2.findContours(separated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        for contour in contours:
            if cv2.contourArea(contour) <= 800:
                continue

            count += 1

            mask = np.zeros(image.shape[:2], dtype=np.uint8)
            cv2.drawContours(mask, [contour], -1, 255, thickness=cv2.FILLED)
            mask = cv2.dilate(mask, kernel, iterations=1)

            transparent_canvas = np.zeros_like(image_bgra)
            transparent_canvas[mask == 255] = image_bgra[mask == 255]

            x, y, w, h = cv2.boundingRect(contour)
            exact_diatom = transparent_canvas[y:y + h, x:x + w]

            save_path = os.path.join(output_dir, f"outline_{count}.png")
            cv2.imwrite(save_path, exact_diatom)

        return output_dir, count

    except Exception as exc:
        raise RuntimeError(f"Error during diatom extraction: {exc}") from exc
