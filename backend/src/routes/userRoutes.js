const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const userController = require('../controllers/userController');
const { validate } = require('../middleware/validation');
const { updateProfileSchema, changePasswordSchema } = require('../validations/authValidation');

const router = express.Router();

/**
 * User Routes
 * All routes require authentication
 */

// GET /api/users/:id - Get user profile
router.get('/:id', authMiddleware, userController.getUserProfile);

// PUT /api/users/:id - Update user profile
router.put('/:id', authMiddleware, validate(updateProfileSchema, 'body'), userController.updateUserProfile);

// PUT /api/users/:id/password - Change password
router.put('/:id/password', authMiddleware, validate(changePasswordSchema, 'body'), userController.changePassword);

module.exports = router;
