const ClassificationRecord = require("../models/ClassificationRecord");
const DiatomClass = require("../models/DiatomClass");
const mockClassifier = require("../utils/mockClassifier");
const axios = require("axios");
const FormData = require("form-data");
const { Readable } = require("stream");

// ML Service configuration
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

/**
 * Classify an uploaded image
 */
const classifyImage = async (req, res) => {
  const { imageBase64 } = req.body;
  const userId = req.user?.id;

  console.log('classificationController: classifyImage called for user', userId);

  if (!imageBase64) {
    console.warn('classificationController: no imageBase64 found in request');
    return res.status(400).json({ success: false, message: "Image data is required" });
  }

  let classification = {
    totalDiatoms: 0,
    speciesBreakdown: {},
    confidenceScores: {},
    waterQualityIndex: 0,
    verdict: 'NO DATA',
  };

  try {
    // Convert base64 to image buffer
    const imageBuffer = Buffer.from(imageBase64, "base64");

    // Create FormData for FastAPI
    const form = new FormData();
    form.append("file", imageBuffer, {
      filename: "image.jpg",
      contentType: "image/jpeg",
    });

    // Call ML service
    const response = await axios.post(`${ML_SERVICE_URL}/predict`, form, {
      headers: {
        ...form.getHeaders(),
        Accept: "application/json",
      },
      timeout: 60000,
    });

    const mlResult = response.data;

    console.log('classificationController: received ML service response', mlResult);

    if (!mlResult || mlResult.success === false) {
      throw new Error(`ML service returned error: ${mlResult?.message || 'unknown'}`);
    }

    classification = {
      totalDiatoms: mlResult.totalDiatoms ?? mlResult.total_diatoms ?? 0,
      speciesBreakdown: mlResult.speciesBreakdown ?? mlResult.species_breakdown ?? {},
      confidenceScores: mlResult.confidenceScores ?? mlResult.confidence_scores ?? {},
      waterQualityIndex: mlResult.waterQualityIndex ?? mlResult.water_quality_index ?? 0,
      verdict: mlResult.verdict ?? 'NO DATA',
    };

    console.log("✓ ML Service full BioLens result:", classification);

  } catch (mlError) {
    console.warn("⚠ ML Service unavailable or bad ML response, using fallback mock result:", mlError?.message || mlError);

    classification = {
      totalDiatoms: 0,
      speciesBreakdown: {},
      confidenceScores: {},
      waterQualityIndex: 0,
      verdict: "NO DATA",
    };
  }

  let record = null;
  try {
    record = new ClassificationRecord({
      userId,
      imageUrl: `data:image/jpeg;base64,${imageBase64.substring(0, 100)}...`,
      predictedClass: classification.verdict,
      confidence: classification.confidenceScores.overall || 0,
      wqi: classification.waterQualityIndex,
    });
    await record.save();
  } catch (saveError) {
    console.error('classificationController: failed to save history record', saveError);
  }

  res.json({
    success: true,
    classification: {
      totalDiatoms: classification.totalDiatoms,
      speciesBreakdown: classification.speciesBreakdown,
      confidenceScores: classification.confidenceScores,
      waterQualityIndex: classification.waterQualityIndex,
      verdict: classification.verdict,
      recordId: record ? record._id : null,
      timestamp: record ? record.createdAt : null,
    },
  });
};

/**
 * Get user's classification history
 */
const getClassificationHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const records = await ClassificationRecord.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      records,
    });
  } catch (err) {
    console.error("History fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching history",
      error: err.message,
    });
  }
};

/**
 * Get a single classification record
 */
const getClassificationRecord = async (req, res) => {
  const { recordId } = req.params;
  const userId = req.user.id;

  try {
    const record = await ClassificationRecord.findById(recordId);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (record.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json({
      success: true,
      record,
    });
  } catch (err) {
    console.error("Record fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching record",
      error: err.message,
    });
  }
};

/**
 * Get all available diatom classes
 */
const getAllDiatomClasses = async (req, res) => {
  try {
    const classes = await DiatomClass.find();
    res.json({
      success: true,
      classes,
    });
  } catch (err) {
    console.error("Classes fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching classes",
      error: err.message,
    });
  }
};

module.exports = {
  classifyImage,
  getClassificationHistory,
  getClassificationRecord,
  getAllDiatomClasses,
};