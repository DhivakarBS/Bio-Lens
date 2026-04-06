/**
 * Mapping of class IDs from ML model to diatom species names
 * Update this based on your trained model's class indices
 */

// Immutable array: index matches ML model output
const CLASS_LABELS = [
  "Asterionella", // 0
  "Cyclotella", // 1
  "Fragilaria", // 2
  "Gomphonema", // 3
  "Navicula", // 4
  "Nitzschia", // 5
];

/**
 * Get the diatom species name from class index
 * @param {number} classIndex - The class index from ML model
 * @returns {{classIndex: number, className: string}} - Both index and name
 */
function getSpeciesName(classIndex) {
  if (
    typeof classIndex !== "number" ||
    classIndex < 0 ||
    classIndex >= CLASS_LABELS.length
  ) {
    return { classIndex, className: `Unknown Species (Class ${classIndex})` };
  }
  return { classIndex, className: CLASS_LABELS[classIndex] };
}

/**
 * Get all available classes
 * @returns {string[]} - The complete class label array
 */
function getAllClasses() {
  return [...CLASS_LABELS];
}

module.exports = {
  getSpeciesName,
  getAllClasses,
  CLASS_LABELS,
};
