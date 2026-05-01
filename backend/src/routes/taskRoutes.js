const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { requireProjectRole } = require('../middleware/rbac');
const taskController = require('../controllers/taskController');
const { validate } = require('../middleware/validation');
const { createTaskSchema, updateTaskSchema, updateTaskStatusSchema, addCommentSchema } = require('../validations/taskValidation');

const router = express.Router({ mergeParams: true });

/**
 * Task Routes
 * All routes require authentication and project membership
 */

// POST /api/projects/:id/tasks - Create task
router.post('/', authMiddleware, requireProjectRole(['admin', 'member']), validate(createTaskSchema, 'body'), taskController.createTask);

// GET /api/projects/:id/tasks - Get project tasks
router.get('/', authMiddleware, requireProjectRole(['admin', 'member']), taskController.getProjectTasks);

// GET /api/projects/:id/tasks/:taskId - Get task details
router.get('/:taskId', authMiddleware, requireProjectRole(['admin', 'member']), taskController.getTaskDetails);

// PUT /api/projects/:id/tasks/:taskId - Update task
router.put('/:taskId', authMiddleware, requireProjectRole(['admin', 'member']), validate(updateTaskSchema, 'body'), taskController.updateTask);

// PATCH /api/projects/:id/tasks/:taskId/status - Update task status
router.patch('/:taskId/status', authMiddleware, requireProjectRole(['admin', 'member']), validate(updateTaskStatusSchema, 'body'), taskController.updateTaskStatus);

// DELETE /api/projects/:id/tasks/:taskId - Delete task
router.delete('/:taskId', authMiddleware, requireProjectRole(['admin', 'member']), taskController.deleteTask);

/**
 * Task Comments Routes
 */

// POST /api/projects/:id/tasks/:taskId/comments - Add comment
router.post('/:taskId/comments', authMiddleware, requireProjectRole(['admin', 'member']), validate(addCommentSchema, 'body'), taskController.addTaskComment);

// GET /api/projects/:id/tasks/:taskId/comments - Get comments
router.get('/:taskId/comments', authMiddleware, requireProjectRole(['admin', 'member']), taskController.getTaskComments);

// DELETE /api/projects/:id/tasks/:taskId/comments/:commentId - Delete comment
router.delete('/:taskId/comments/:commentId', authMiddleware, requireProjectRole(['admin', 'member']), taskController.deleteTaskComment);

module.exports = router;
