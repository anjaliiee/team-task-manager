const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');

// Success Response
exports.sendSuccess = (res, data, message = 'Success', statusCode = HTTP_STATUS.OK) => {
  return res.status(statusCode).json({
    status: statusCode,
    data,
    message,
  });
};

// Error Response
exports.sendError = (res, statusCode = HTTP_STATUS.BAD_REQUEST, error = ERROR_CODES.SERVER_ERROR, message = 'An error occurred', details = null) => {
  const response = {
    status: statusCode,
    error,
    message,
  };

  if (details) {
    response.details = details;
  }

  return res.status(statusCode).json(response);
};

// Validation Error Response
exports.sendValidationError = (res, message = 'Validation error', details = null) => {
  return exports.sendError(
    res,
    HTTP_STATUS.BAD_REQUEST,
    ERROR_CODES.VALIDATION_ERROR,
    message,
    details
  );
};

// Unauthorized Error Response
exports.sendUnauthorized = (res, message = 'Unauthorized access') => {
  return exports.sendError(
    res,
    HTTP_STATUS.UNAUTHORIZED,
    ERROR_CODES.UNAUTHORIZED,
    message
  );
};

// Forbidden Error Response
exports.sendForbidden = (res, message = 'Insufficient permissions') => {
  return exports.sendError(
    res,
    HTTP_STATUS.FORBIDDEN,
    ERROR_CODES.FORBIDDEN,
    message
  );
};

// Not Found Error Response
exports.sendNotFound = (res, message = 'Resource not found') => {
  return exports.sendError(
    res,
    HTTP_STATUS.NOT_FOUND,
    ERROR_CODES.NOT_FOUND,
    message
  );
};

// Conflict Error Response
exports.sendConflict = (res, message = 'Resource already exists') => {
  return exports.sendError(
    res,
    HTTP_STATUS.CONFLICT,
    ERROR_CODES.CONFLICT,
    message
  );
};

// Server Error Response
exports.sendServerError = (res, message = 'Internal server error') => {
  return exports.sendError(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    ERROR_CODES.SERVER_ERROR,
    message
  );
};
