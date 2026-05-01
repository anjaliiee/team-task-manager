const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { requireProjectRole } = require('../middleware/rbac');
const projectController = require('../controllers/projectController');
const { validate } = require('../middleware/validation');
const { createProjectSchema, updateProjectSchema, addMemberSchema, updateMemberRoleSchema } = require('../validations/projectValidation');

const router = express.Router();

/**
 * Project Routes
 */

router.post('/', authMiddleware, validate(createProjectSchema, 'body'), projectController.createProject);

router.get('/', authMiddleware, projectController.getAllProjects);

router.get('/:id', authMiddleware, requireProjectRole(['admin', 'member']), projectController.getProjectDetails);

router.put('/:id', authMiddleware, requireProjectRole(['admin']), validate(updateProjectSchema, 'body'), projectController.updateProject);

router.delete('/:id', authMiddleware, requireProjectRole(['admin']), projectController.deleteProject);

/**
 * Members Routes
 */

router.post('/:id/members', authMiddleware, requireProjectRole(['admin']), validate(addMemberSchema, 'body'), projectController.addProjectMember);

router.get('/:id/members', authMiddleware, requireProjectRole(['admin', 'member']), projectController.getProjectMembers);

router.delete('/:id/members/:userId', authMiddleware, requireProjectRole(['admin']), projectController.removeProjectMember);

router.put('/:id/members/:userId', authMiddleware, requireProjectRole(['admin']), validate(updateMemberRoleSchema, 'body'), projectController.updateMemberRole);

/**
 * 🔥 TASK ROUTES (COMPLETE CRUD)
 */

// CREATE TASK
router.post('/:id/tasks', authMiddleware, requireProjectRole(['admin', 'member']), projectController.createTask);

// GET TASKS
router.get('/:id/tasks', authMiddleware, requireProjectRole(['admin', 'member']), projectController.getProjectTasks);

// UPDATE TASK
router.put('/:id/tasks/:taskId', authMiddleware, requireProjectRole(['admin', 'member']), projectController.updateTask);

// DELETE TASK
router.delete('/:id/tasks/:taskId', authMiddleware, requireProjectRole(['admin', 'member']), projectController.deleteTask);

module.exports = router;