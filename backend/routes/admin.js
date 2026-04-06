const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/authenticate');

/**
 * POST /api/admin/login
 * Admin login
 */
router.post('/login', adminController.adminLogin);

/**
 * GET /api/admin/stats
 * Get dashboard statistics
 */
router.get('/stats', authenticateAdmin, adminController.getDashboardStats);

/**
 * GET /api/admin/logs
 * Get classification logs
 */
router.get('/logs', authenticateAdmin, adminController.getClassificationLogs);

/**
 * POST /api/admin/diatom-classes
 * Create a new diatom class
 */
router.post('/diatom-classes', authenticateAdmin, adminController.createDiatomClass);

/**
 * GET /api/admin/diatom-classes
 * Get all diatom classes
 */
router.get('/diatom-classes', authenticateAdmin, adminController.getAllDiatomClasses);

/**
 * PUT /api/admin/diatom-classes/:classId
 * Update a diatom class
 */
router.put('/diatom-classes/:classId', authenticateAdmin, adminController.updateDiatomClass);

/**
 * DELETE /api/admin/diatom-classes/:classId
 * Delete a diatom class
 */
router.delete('/diatom-classes/:classId', authenticateAdmin, adminController.deleteDiatomClass);

module.exports = router;
