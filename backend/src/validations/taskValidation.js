const Joi = require('joi');

// Create Task Validation
const createTaskSchema = Joi.object({
  title: Joi.string().required().min(3).max(255).messages({
    'string.empty': 'Task title is required',
    'string.min': 'Task title must be at least 3 characters',
    'string.max': 'Task title must not exceed 255 characters',
  }),
  description: Joi.string().max(5000).allow('').messages({
    'string.max': 'Description must not exceed 5000 characters',
  }),
  assignee_id: Joi.number().integer().positive().allow(null).messages({
    'number.base': 'Assignee ID must be a number',
    'number.positive': 'Assignee ID must be positive',
  }),
  due_date: Joi.date().iso().min('now').allow(null).messages({
    'date.base': 'Due date must be a valid date',
    'date.min': 'Due date must be today or later',
  }),
});

// Update Task Validation
const updateTaskSchema = Joi.object({
  title: Joi.string().min(3).max(255).messages({
    'string.min': 'Task title must be at least 3 characters',
    'string.max': 'Task title must not exceed 255 characters',
  }),
  description: Joi.string().max(5000).allow('').messages({
    'string.max': 'Description must not exceed 5000 characters',
  }),
  assignee_id: Joi.number().integer().positive().allow(null).messages({
    'number.base': 'Assignee ID must be a number',
    'number.positive': 'Assignee ID must be positive',
  }),
  due_date: Joi.date().iso().min('now').allow(null).messages({
    'date.base': 'Due date must be a valid date',
    'date.min': 'Due date must be today or later',
  }),
}).min(1);

// Update Task Status Validation
const updateTaskStatusSchema = Joi.object({
  status: Joi.string()
    .required()
    .valid('todo', 'in_progress', 'completed')
    .messages({
      'string.empty': 'Status is required',
      'any.only': 'Status must be one of: todo, in_progress, completed',
    }),
});

// Add Comment Validation
const addCommentSchema = Joi.object({
  content: Joi.string().required().min(1).max(5000).messages({
    'string.empty': 'Comment content is required',
    'string.max': 'Comment must not exceed 5000 characters',
  }),
});

// Task Filters Validation
const taskFiltersSchema = Joi.object({
  status: Joi.string().valid('todo', 'in_progress', 'completed'),
  assignee_id: Joi.number().integer().positive(),
  due_date_from: Joi.date().iso(),
  due_date_to: Joi.date().iso(),
  sort: Joi.string().valid('due_date', 'created_at', 'status'),
  order: Joi.string().valid('asc', 'desc'),
  page: Joi.number().integer().positive().default(1),
  limit: Joi.number().integer().positive().max(100).default(20),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  addCommentSchema,
  taskFiltersSchema,
};
