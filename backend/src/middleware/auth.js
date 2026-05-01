const { verifyToken } = require('../utils/jwt');
const { sendUnauthorized } = require('../utils/response');
const logger = require('../utils/logger');

// Authentication Middleware - Verify JWT Token
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Missing or invalid Authorization header');
      return sendUnauthorized(res, 'Authorization header missing or invalid');
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      req.token = token;
      logger.debug('JWT verified', { user_id: decoded.user_id });
      next();
    } catch (error) {
      logger.warn('JWT verification failed', { error: error.message });

      if (error.name === 'TokenExpiredError') {
        return sendUnauthorized(res, 'Token has expired');
      }

      return sendUnauthorized(res, 'Invalid or malformed token');
    }
  } catch (error) {
    logger.error('Auth middleware error', { error: error.message });
    return sendUnauthorized(res, 'Authentication failed');
  }
};

// Middleware to check if user is authenticated (optional - doesn't throw error)
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      try {
        const decoded = verifyToken(token);
        req.user = decoded;
        req.token = token;
      } catch (error) {
        logger.debug('Optional auth token invalid (ignored)');
      }
    }

    next();
  } catch (error) {
    logger.debug('Optional auth middleware error (ignored)', { error: error.message });
    next();
  }
};

module.exports = {
  authMiddleware,
  optionalAuth,
};
