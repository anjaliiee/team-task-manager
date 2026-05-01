const pool = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');
const { HTTP_STATUS } = require('../config/constants');

/**
 * GET /api/dashboard/summary
 */
exports.getDashboardSummary = (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT t.status, COUNT(*) as count
    FROM tasks t
    JOIN project_members pm ON pm.project_id = t.project_id
    WHERE pm.user_id = ?
    AND t.deleted_at IS NULL
    GROUP BY t.status
  `;

  pool.query(sql, [user_id], (err, results) => {
    if (err) {
      logger.error('getDashboardSummary error', err);
      return sendError(res, 500, 'DB_ERROR', err.message);
    }

    const summary = {
      todo: 0,
      in_progress: 0,
      completed: 0,
    };

    results.forEach((r) => {
      summary[r.status] = r.count;
    });

    sendSuccess(res, summary, 'Dashboard summary fetched');
  });
};

/**
 * GET /api/tasks/overdue
 */
exports.getOverdueTasks = (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT t.*
    FROM tasks t
    JOIN project_members pm ON pm.project_id = t.project_id
    WHERE pm.user_id = ?
    AND t.due_date < CURDATE()
    AND t.status != 'completed'
    AND t.deleted_at IS NULL
    ORDER BY t.due_date ASC
  `;

  pool.query(sql, [user_id], (err, results) => {
    if (err) {
      logger.error('getOverdueTasks error', err);
      return sendError(res, 500, 'DB_ERROR', err.message);
    }

    sendSuccess(res, results, 'Overdue tasks fetched');
  });
};

/**
 * GET /api/tasks/assigned-to-me
 */
exports.getMyTasks = (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT *
    FROM tasks
    WHERE assignee_id = ?
    AND deleted_at IS NULL
    ORDER BY due_date ASC
  `;

  pool.query(sql, [user_id], (err, results) => {
    if (err) {
      logger.error('getMyTasks error', err);
      return sendError(res, 500, 'DB_ERROR', err.message);
    }

    sendSuccess(res, results, 'My tasks fetched');
  });
};

/**
 * GET /api/projects/:id/dashboard
 */
exports.getProjectDashboard = (req, res) => {
  const project_id = req.params.id;

  const sql = `
    SELECT status, COUNT(*) as count
    FROM tasks
    WHERE project_id = ?
    AND deleted_at IS NULL
    GROUP BY status
  `;

  pool.query(sql, [project_id], (err, results) => {
    if (err) {
      logger.error('getProjectDashboard error', err);
      return sendError(res, 500, 'DB_ERROR', err.message);
    }

    const summary = {
      todo: 0,
      in_progress: 0,
      completed: 0,
    };

    results.forEach((r) => {
      summary[r.status] = r.count;
    });

    sendSuccess(res, summary, 'Project dashboard fetched');
  });
};

/**
 * GET /api/projects/:id/stats
 */
exports.getProjectStats = (req, res) => {
  const project_id = req.params.id;

  const sql = `
    SELECT 
      COUNT(*) as total_tasks,
      SUM(status = 'todo') as todo,
      SUM(status = 'in_progress') as in_progress,
      SUM(status = 'completed') as completed
    FROM tasks
    WHERE project_id = ?
    AND deleted_at IS NULL
  `;

  pool.query(sql, [project_id], (err, results) => {
    if (err) {
      logger.error('getProjectStats error', err);
      return sendError(res, 500, 'DB_ERROR', err.message);
    }

    sendSuccess(res, results[0], 'Project stats fetched');
  });
};

module.exports = exports;