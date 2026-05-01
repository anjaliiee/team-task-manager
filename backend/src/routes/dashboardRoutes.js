const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

/**
 * Dashboard Routes
 * All routes require authentication
 */

// GET /api/dashboard/summary - Get user dashboard summary
router.get('/summary', authMiddleware, dashboardController.getDashboardSummary);

// GET /api/tasks/overdue - Get overdue tasks
router.get('/tasks/overdue', authMiddleware, dashboardController.getOverdueTasks);

// GET /api/tasks/assigned-to-me - Get tasks assigned to user
router.get('/tasks/assigned-to-me', authMiddleware, dashboardController.getMyTasks);

// GET /api/projects/:id/dashboard - Get project dashboard
router.get('/projects/:id/dashboard', authMiddleware, dashboardController.getProjectDashboard);

// GET /api/projects/:id/stats - Get project statistics
router.get('/projects/:id/stats', authMiddleware, dashboardController.getProjectStats);

module.exports = router;
