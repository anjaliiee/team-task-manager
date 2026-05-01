const { sendValidationError } = require('../utils/response');
const logger = require('../utils/logger');

// Validation Middleware - Validate request using Joi schema
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    try {
      const dataToValidate = req[property];
      const { error, value } = schema.validate(dataToValidate, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const details = {};
        error.details.forEach((detail) => {
          const field = detail.path.join('.');
          details[field] = detail.message;
        });

        logger.warn('Validation failed', { property, details });
        return sendValidationError(res, 'Validation failed', details);
      }

      // Replace the property with validated data
      req[property] = value;
      logger.debug('Validation passed', { property });
      next();
    } catch (error) {
      logger.error('Validation middleware error', { error: error.message });
      return sendValidationError(res, 'Validation error occurred');
    }
  };
};

// Simple field validation
const validateRequired = (fields = []) => {
  return (req, res, next) => {
    try {
      const missingFields = [];

      fields.forEach((field) => {
        if (!req.body[field]) {
          missingFields.push(field);
        }
      });

      if (missingFields.length > 0) {
        logger.warn('Required fields missing', { missingFields });
        const details = {};
        missingFields.forEach((field) => {
          details[field] = `${field} is required`;
        });
        return sendValidationError(res, 'Required fields missing', details);
      }

      logger.debug('Required fields check passed', { fields });
      next();
    } catch (error) {
      logger.error('Required fields validation error', { error: error.message });
      return sendValidationError(res, 'Validation error occurred');
    }
  };
};

module.exports = {
  validate,
  validateRequired,
};
