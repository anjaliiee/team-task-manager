const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');
const logger = require('../utils/logger');

// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Default error response
  let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let errorCode = ERROR_CODES.SERVER_ERROR;
  let message = 'An internal server error occurred';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorCode = ERROR_CODES.VALIDATION_ERROR;
    message = err.message || 'Validation error';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    errorCode = ERROR_CODES.UNAUTHORIZED;
    message = err.message || 'Unauthorized';
  } else if (err.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorCode = ERROR_CODES.VALIDATION_ERROR;
    message = 'Invalid ID format';
  } else if (err.code === 'ER_DUP_ENTRY') {
    statusCode = HTTP_STATUS.CONFLICT;
    errorCode = ERROR_CODES.CONFLICT;
    message = 'Resource already exists';
  }

  // Send error response
  res.status(statusCode).json({
    status: statusCode,
    error: errorCode,
    message,
  });
};

// 404 Not Found Middleware
const notFoundHandler = (req, res) => {
  logger.warn('Route not found', { path: req.path, method: req.method });

  res.status(HTTP_STATUS.NOT_FOUND).json({
    status: HTTP_STATUS.NOT_FOUND,
    error: ERROR_CODES.NOT_FOUND,
    message: `Route ${req.method} ${req.path} not found`,
  });
};

// Async Error Wrapper (for use with async route handlers)
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
