// User Controller

const { sendSuccess, sendError, sendForbidden, sendNotFound, sendUnauthorized } = require('../utils/response');
const { comparePassword, hashPassword } = require('../utils/bcrypt');
const userModel = require('../models/userModel');
const logger = require('../utils/logger');
const { HTTP_STATUS, MESSAGES } = require('../config/constants');

/**
 * Get User Profile
 * GET /api/users/:id
 * Requires: Valid JWT token
 */
exports.getUserProfile = (req, res) => {
  const userId = req.params.id;
  logger.debug('Get user profile request received', { userId, requestedBy: req.user.user_id });

  // Users can only view their own profile (unless they're admin - not implemented yet)
  if (parseInt(userId) !== req.user.user_id) {
    logger.warn('Unauthorized profile access attempt', { userId, requestedBy: req.user.user_id });
    return sendForbidden(res, 'You can only view your own profile');
  }

  userModel.getUserById(userId, (err, user) => {
    if (err) {
      logger.error('Database error fetching user profile', { error: err.message });
      return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
    }

    if (!user) {
      logger.warn('User not found', { userId });
      return sendNotFound(res, 'User not found');
    }

    // Don't return password hash
    const { password_hash, ...userWithoutPassword } = user;
    logger.info('User profile retrieved', { userId });
    return sendSuccess(res, userWithoutPassword, 'User profile retrieved successfully');
  });
};

/**
 * Update User Profile
 * PUT /api/users/:id
 * Body: { name?, email? }
 * Requires: Valid JWT token
 */
exports.updateUserProfile = (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  logger.debug('Update user profile request received', { userId, requestedBy: req.user.user_id });

  // Users can only update their own profile
  if (parseInt(userId) !== req.user.user_id) {
    logger.warn('Unauthorized profile update attempt', { userId, requestedBy: req.user.user_id });
    return sendForbidden(res, 'You can only update your own profile');
  }

  // Check if email is already in use (if updating email)
  if (email && email !== req.user.email) {
    userModel.getUserByEmail(email, (err, existingUser) => {
      if (err) {
        logger.error('Database error checking email', { error: err.message });
        return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
      }

      if (existingUser) {
        logger.warn('Update profile with existing email', { email, userId });
        return sendError(res, HTTP_STATUS.CONFLICT, 'EMAIL_EXISTS', 'Email already in use');
      }

      // Update user
      updateUserData(res, userId, { name, email });
    });
  } else {
    updateUserData(res, userId, { name, email });
  }
};

/**
 * Helper function to update user data
 */
function updateUserData(res, userId, updateData) {
  const dataToUpdate = {};
  if (updateData.name) dataToUpdate.name = updateData.name;
  if (updateData.email) dataToUpdate.email = updateData.email;

  if (Object.keys(dataToUpdate).length === 0) {
    logger.warn('Update user profile with no data', { userId });
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'NO_DATA', 'No data to update');
  }

  userModel.updateUser(userId, dataToUpdate, (err, updatedUser) => {
    if (err) {
      logger.error('Database error updating user', { error: err.message });
      return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
    }

    if (!updatedUser) {
      logger.warn('User not found for update', { userId });
      return sendNotFound(res, 'User not found');
    }

    // Don't return password hash
    const { password_hash, ...userWithoutPassword } = updatedUser;
    logger.info('User profile updated', { userId });
    return sendSuccess(res, userWithoutPassword, 'User profile updated successfully');
  });
}

/**
 * Change Password
 * PUT /api/users/:id/password
 * Body: { currentPassword, newPassword }
 * Requires: Valid JWT token
 */
exports.changePassword = async (req, res) => {
  const userId = req.params.id;
  const { currentPassword, newPassword } = req.body;
  logger.debug('Change password request received', { userId, requestedBy: req.user.user_id });

  // Users can only change their own password
  if (parseInt(userId) !== req.user.user_id) {
    logger.warn('Unauthorized password change attempt', { userId, requestedBy: req.user.user_id });
    return sendForbidden(res, 'You can only change your own password');
  }

  // Get user with password hash
  userModel.getUserById(userId, async (err, user) => {
    if (err) {
      logger.error('Database error fetching user', { error: err.message });
      return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
    }

    if (!user) {
      logger.warn('User not found for password change', { userId });
      return sendNotFound(res, 'User not found');
    }

    try {
      // Verify current password
      const isCurrentPasswordValid = await comparePassword(currentPassword, user.password_hash);

      if (!isCurrentPasswordValid) {
        logger.warn('Invalid current password in change password request', { userId });
        return sendUnauthorized(res, 'Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);

      // Update password
      userModel.updateUser(userId, { password_hash: hashedNewPassword }, (err, updatedUser) => {
        if (err) {
          logger.error('Database error updating password', { error: err.message });
          return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
        }

        logger.info('Password changed successfully', { userId });
        return sendSuccess(res, {}, 'Password changed successfully');
      });
    } catch (error) {
      logger.error('Error in password change process', { error: error.message });
      return sendError(res, HTTP_STATUS.SERVER_ERROR, 'HASH_ERROR', MESSAGES.SERVER_ERROR);
    }
  });
};

module.exports = exports;
