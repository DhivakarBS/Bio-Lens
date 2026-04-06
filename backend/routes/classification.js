const express = require('express');
const router = express.Router();
const classificationController = require('../controllers/classificationController');
const { authenticateUser } = require('../middleware/authenticate');

/**
 * POST /api/classification/classify
 * Classify an uploaded image
 */
router.post('/classify', authenticateUser, classificationController.classifyImage);

/**
 * GET /api/classification/history
 * Get user's classification history
 */
router.get('/history', authenticateUser, classificationController.getClassificationHistory);

/**
 * GET /api/classification/:recordId
 * Get a specific classification record
 */
router.get('/:recordId', authenticateUser, classificationController.getClassificationRecord);

/**
 * GET /api/classification/classes/all
 * Get all available diatom classes
 */
router.get('/classes/all', classificationController.getAllDiatomClasses);

module.exports = router;
