const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { requireProjectRole } = require('../middleware/rbac');
const projectController = require('../controllers/projectController');
const { validate } = require('../middleware/validation');
const { createProjectSchema, updateProjectSchema, addMemberSchema, updateMemberRoleSchema } = require('../validations/projectValidation');

const router = express.Router();

/**
 * Project Routes
 * All routes require authentication
 */

// POST /api/projects - Create project
router.post('/', authMiddleware, validate(createProjectSchema, 'body'), projectController.createProject);

// GET /api/projects - Get all user's projects
router.get('/', authMiddleware, projectController.getAllProjects);

// GET /api/projects/:id - Get project details
router.get('/:id', authMiddleware, requireProjectRole(['admin', 'member']), projectController.getProjectDetails);

// PUT /api/projects/:id - Update project (admin only)
router.put('/:id', authMiddleware, requireProjectRole(['admin']), validate(updateProjectSchema, 'body'), projectController.updateProject);

// DELETE /api/projects/:id - Delete project (admin only)
router.delete('/:id', authMiddleware, requireProjectRole(['admin']), projectController.deleteProject);

/**
 * Project Members Routes
 */

// POST /api/projects/:id/members - Add member (admin only)
router.post('/:id/members', authMiddleware, requireProjectRole(['admin']), validate(addMemberSchema, 'body'), projectController.addProjectMember);

// GET /api/projects/:id/members - Get project members
router.get('/:id/members', authMiddleware, requireProjectRole(['admin', 'member']), projectController.getProjectMembers);

// DELETE /api/projects/:id/members/:userId - Remove member (admin only)
router.delete('/:id/members/:userId', authMiddleware, requireProjectRole(['admin']), projectController.removeProjectMember);

// PUT /api/projects/:id/members/:userId - Update member role (admin only)
router.put('/:id/members/:userId', authMiddleware, requireProjectRole(['admin']), validate(updateMemberRoleSchema, 'body'), projectController.updateMemberRole);

module.exports = router;
