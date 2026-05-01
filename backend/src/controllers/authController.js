// Auth Controller - placeholder
// This will handle authentication endpoints

const { sendSuccess, sendValidationError, sendUnauthorized, sendError } = require('../utils/response');
const { generateToken } = require('../utils/jwt');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const userModel = require('../models/userModel');
const logger = require('../utils/logger');
const { HTTP_STATUS, MESSAGES } = require('../config/constants');

/**
 * Signup - Register new user
 * POST /api/auth/signup
 * Body: { name, email, password }
 */
exports.signup = (req, res) => {
  const { name, email, password } = req.body;
  logger.debug('Signup request received', { email });

  // Check if user already exists
  userModel.getUserByEmail(email, async (err, user) => {
    if (err) {
      logger.error('Database error in signup', { error: err.message });
      return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
    }

    if (user) {
      logger.warn('Signup attempted with existing email', { email });
      return sendError(
        res,
        HTTP_STATUS.CONFLICT,
        'EMAIL_EXISTS',
        'Email is already registered',
        { email: 'Email already in use' }
      );
    }

    try {
      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      userModel.createUser({ name, email, password_hash: hashedPassword }, (err, newUser) => {
        if (err) {
          logger.error('Error creating user', { error: err.message });
          return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
        }

        // Generate JWT token
        const token = generateToken({
          user_id: newUser.id,
          email: newUser.email,
          name: newUser.name
        });

        logger.info('User registered successfully', { userId: newUser.id, email });
        return sendSuccess(
          res,
          { user_id: newUser.id, name: newUser.name, email: newUser.email, token },
          'User registered successfully',
          HTTP_STATUS.CREATED
        );
      });
    } catch (error) {
      logger.error('Error hashing password', { error: error.message });
      return sendError(res, HTTP_STATUS.SERVER_ERROR, 'HASH_ERROR', MESSAGES.SERVER_ERROR);
    }
  });
};

/**
 * Login - Authenticate user
 * POST /api/auth/login
 * Body: { email, password }
 */
exports.login = (req, res) => {
  const { email, password } = req.body;
  logger.debug('Login request received', { email });

  // Find user by email
  userModel.getUserByEmail(email, async (err, user) => {
    if (err) {
      logger.error('Database error in login', { error: err.message });
      return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
    }

    if (!user) {
      logger.warn('Login attempt with non-existent email', { email });
      return sendUnauthorized(res, 'Invalid email or password');
    }

    try {
      // Compare password
      const isPasswordValid = await comparePassword(password, user.password_hash);

      if (!isPasswordValid) {
        logger.warn('Login attempt with invalid password', { email });
        return sendUnauthorized(res, 'Invalid email or password');
      }

      // Generate JWT token
      const token = generateToken({
        user_id: user.id,
        email: user.email,
        name: user.name
      });

      logger.info('User logged in successfully', { userId: user.id, email });
      return sendSuccess(
        res,
        { user_id: user.id, name: user.name, email: user.email, token },
        'Login successful',
        HTTP_STATUS.OK
      );
    } catch (error) {
      logger.error('Error comparing passwords', { error: error.message });
      return sendError(res, HTTP_STATUS.SERVER_ERROR, 'AUTH_ERROR', MESSAGES.SERVER_ERROR);
    }
  });
};

/**
 * Refresh Token - Generate new access token
 * POST /api/auth/refresh
 * Requires valid JWT in Authorization header
 */
exports.refreshToken = (req, res) => {
  logger.debug('Token refresh request received', { userId: req.user.user_id });

  try {
    // Generate new token with current user info
    const token = generateToken({
      user_id: req.user.user_id,
      email: req.user.email,
      name: req.user.name
    });

    logger.info('Token refreshed successfully', { userId: req.user.user_id });
    return sendSuccess(
      res,
      { token },
      'Token refreshed successfully',
      HTTP_STATUS.OK
    );
  } catch (error) {
    logger.error('Error refreshing token', { error: error.message });
    return sendError(res, HTTP_STATUS.SERVER_ERROR, 'TOKEN_ERROR', MESSAGES.SERVER_ERROR);
  }
};

/**
 * Logout - Clear authentication
 * POST /api/auth/logout
 * Requires valid JWT in Authorization header
 */
exports.logout = (req, res) => {
  logger.info('User logged out', { userId: req.user.user_id });
  // Logout is handled on client by removing token from localStorage
  // Server doesn't need to do anything for JWT-based auth
  return sendSuccess(
    res,
    {},
    'Logout successful',
    HTTP_STATUS.OK
  );
};

module.exports = exports;
