const Joi = require('joi');

// Signup Validation
const signupSchema = Joi.object({
  name: Joi.string().required().min(3).max(255).messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 3 characters',
    'string.max': 'Name must not exceed 255 characters',
  }),
  email: Joi.string().required().email().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be valid',
  }),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(/[A-Z]/)
    .pattern(/[0-9]/)
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least 1 uppercase letter and 1 number',
    }),
});

// Login Validation
const loginSchema = Joi.object({
  email: Joi.string().required().email().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be valid',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

// Update Profile Validation
const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).max(255),
  email: Joi.string().email(),
  password: Joi.string()
    .min(8)
    .pattern(/[A-Z]/)
    .pattern(/[0-9]/)
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least 1 uppercase letter and 1 number',
    }),
}).min(1);

// Change Password Validation
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.empty': 'Current password is required',
  }),
  newPassword: Joi.string()
    .required()
    .min(8)
    .pattern(/[A-Z]/)
    .pattern(/[0-9]/)
    .messages({
      'string.empty': 'New password is required',
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least 1 uppercase letter and 1 number',
    }),
});

module.exports = {
  signupSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
};
