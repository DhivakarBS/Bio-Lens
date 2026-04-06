from ml_service.classifier import TOLERANCE_SCORES


def calculate_wqi(class_counts):
    total_diatoms = sum(class_counts.values())
    total_score = 0

    for species, count in class_counts.items():
        score = TOLERANCE_SCORES.get(species, 3)
        total_score += score * count

    if total_diatoms == 0:
        return 0, "NO DATA"

    wqi = total_score / total_diatoms

    if wqi <= 2.2:
        verdict = "SAFE"
    elif wqi <= 3.6:
        verdict = "CAUTION"
    else:
        verdict = "UNSAFE"

    return round(wqi, 2), verdict