const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/auth');
const { requireProjectRole } = require('../middleware/rbac');
const { validate } = require('../middleware/validation');

const projectController = require('../controllers/projectController');

const {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
  updateMemberRoleSchema
} = require('../validations/projectValidation');

/**
 * =========================
 * PROJECT ROUTES
 * =========================
 */
router.post(
  '/',
  authMiddleware,
  validate(createProjectSchema, 'body'),
  projectController.createProject
);

router.get(
  '/',
  authMiddleware,
  projectController.getAllProjects
);

router.get(
  '/:id',
  authMiddleware,
  requireProjectRole(['admin', 'member']),
  projectController.getProjectDetails
);

router.put(
  '/:id',
  authMiddleware,
  requireProjectRole(['admin']),
  validate(updateProjectSchema, 'body'),
  projectController.updateProject
);

router.delete(
  '/:id',
  authMiddleware,
  requireProjectRole(['admin']),
  projectController.deleteProject
);

/**
 * =========================
 * MEMBERS
 * =========================
 */
router.post(
  '/:id/members',
  authMiddleware,
  requireProjectRole(['admin']),
  validate(addMemberSchema, 'body'),
  projectController.addProjectMember
);

router.post(
  '/:id/invite',
  authMiddleware,
  requireProjectRole(['admin']),
  projectController.inviteMember
);

router.get(
  '/:id/members',
  authMiddleware,
  requireProjectRole(['admin', 'member']),
  projectController.getProjectMembers
);

router.delete(
  '/:id/members/:userId',
  authMiddleware,
  requireProjectRole(['admin']),
  projectController.removeProjectMember
);

router.put(
  '/:id/members/:userId',
  authMiddleware,
  requireProjectRole(['admin']),
  validate(updateMemberRoleSchema, 'body'),
  projectController.updateMemberRole
);

/**
 * =========================
 * TASK ROUTES
 * =========================
 */
router.post(
  '/:id/tasks',
  authMiddleware,
  requireProjectRole(['admin', 'member']),
  projectController.createTask
);

router.get(
  '/:id/tasks',
  authMiddleware,
  requireProjectRole(['admin', 'member']),
  projectController.getProjectTasks
);

router.put(
  '/:id/tasks/:taskId',
  authMiddleware,
  requireProjectRole(['admin', 'member']),
  projectController.updateTask
);

router.patch(
  '/:id/tasks/:taskId/status',
  authMiddleware,
  requireProjectRole(['admin', 'member']),
  projectController.updateTaskStatus
);

router.delete(
  '/:id/tasks/:taskId',
  authMiddleware,
  requireProjectRole(['admin', 'member']),
  projectController.deleteTask
);

module.exports = router;