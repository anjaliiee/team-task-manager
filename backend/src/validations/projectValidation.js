const Joi = require('joi');

// Create Project Validation
const createProjectSchema = Joi.object({
  name: Joi.string().required().min(3).max(255).messages({
    'string.empty': 'Project name is required',
    'string.min': 'Project name must be at least 3 characters',
    'string.max': 'Project name must not exceed 255 characters',
  }),
  description: Joi.string().max(5000).allow('').messages({
    'string.max': 'Description must not exceed 5000 characters',
  }),
});

// Update Project Validation
const updateProjectSchema = Joi.object({
  name: Joi.string().min(3).max(255).messages({
    'string.min': 'Project name must be at least 3 characters',
    'string.max': 'Project name must not exceed 255 characters',
  }),
  description: Joi.string().max(5000).allow('').messages({
    'string.max': 'Description must not exceed 5000 characters',
  }),
}).min(1);

// Add Member Validation
const addMemberSchema = Joi.object({
  user_id: Joi.number().required().integer().positive().messages({
    'number.base': 'User ID must be a number',
    'number.empty': 'User ID is required',
    'number.positive': 'User ID must be positive',
  }),
  role: Joi.string()
    .required()
    .valid('admin', 'member')
    .messages({
      'string.empty': 'Role is required',
      'any.only': 'Role must be either "admin" or "member"',
    }),
});

// Update Member Role Validation
const updateMemberRoleSchema = Joi.object({
  role: Joi.string()
    .required()
    .valid('admin', 'member')
    .messages({
      'string.empty': 'Role is required',
      'any.only': 'Role must be either "admin" or "member"',
    }),
});

module.exports = {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
  updateMemberRoleSchema,
};
