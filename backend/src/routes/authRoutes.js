const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validation');
const { signupSchema, loginSchema } = require('../validations/authValidation');

const router = express.Router();

/**
 * Auth Routes
 * All public routes (no auth required)
 */

// POST /api/auth/signup - Register new user
router.post('/signup', validate(signupSchema, 'body'), authController.signup);

// POST /api/auth/login - Login user
router.post('/login', validate(loginSchema, 'body'), authController.login);

// POST /api/auth/refresh - Refresh JWT token
router.post('/refresh', authMiddleware, authController.refreshToken);

// POST /api/auth/logout - Logout user
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
