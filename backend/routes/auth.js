const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authenticate');

/**
 * POST /api/auth/signup
 * Register a new user
 */
router.post('/signup', authController.userSignup);

/**
 * POST /api/auth/register
 * Alias for signup for compatibility
 */
router.post('/register', authController.userSignup);

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', authController.userLogin);

/**
 * GET /api/auth/profile
 * Get authenticated user profile
 */
router.get('/profile', authenticateUser, authController.getUserProfile);

module.exports = router;
