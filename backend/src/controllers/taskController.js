const taskModel = require('../models/taskModel');
const pool = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');
const { HTTP_STATUS } = require('../config/constants');

/**
 * Create Task
 */
exports.createTask = (req, res) => {
  const project_id = req.params.id;
  const { title, description, assignee_id, due_date } = req.body;

  taskModel.createTask(
    { title, description, project_id, assignee_id, due_date },
    (err, task) => {
      if (err) return sendError(res, 500, 'DB_ERROR', err.message);

      // ✅ FIXED ORDER
      sendSuccess(res, task, 'Task created', HTTP_STATUS.CREATED);
    }
  );
};

/**
 * Get Project Tasks
 */
exports.getProjectTasks = (req, res) => {
  const project_id = req.params.id;

  taskModel.getProjectTasks(project_id, req.query, (err, tasks) => {
    if (err) return sendError(res, 500, 'DB_ERROR', err.message);

    // ✅ FIXED
    sendSuccess(res, tasks, 'Tasks fetched', HTTP_STATUS.OK);
  });
};

/**
 * Get Task Details
 */
exports.getTaskDetails = (req, res) => {
  const { taskId } = req.params;

  taskModel.getTaskById(taskId, (err, task) => {
    if (err) return sendError(res, 500, 'DB_ERROR', err.message);
    if (!task) return sendError(res, 404, 'NOT_FOUND', 'Task not found');

    // ✅ FIXED
    sendSuccess(res, task, 'Task fetched', HTTP_STATUS.OK);
  });
};

/**
 * Update Task
 */
exports.updateTask = (req, res) => {
  const { taskId } = req.params;

  taskModel.updateTask(taskId, req.body, (err, task) => {
    if (err) return sendError(res, 500, 'DB_ERROR', err.message);

    // ✅ FIXED
    sendSuccess(res, task, 'Task updated', HTTP_STATUS.OK);
  });
};

/**
 * Update Task Status
 */
exports.updateTaskStatus = (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  taskModel.updateTaskStatus(taskId, status, (err, task) => {
    if (err) return sendError(res, 500, 'DB_ERROR', err.message);

    // ✅ FIXED
    sendSuccess(res, task, 'Status updated', HTTP_STATUS.OK);
  });
};

/**
 * Delete Task
 */
exports.deleteTask = (req, res) => {
  const { taskId } = req.params;

  taskModel.deleteTask(taskId, (err) => {
    if (err) return sendError(res, 500, 'DB_ERROR', err.message);

    // ✅ FIXED
    sendSuccess(res, null, 'Task deleted', HTTP_STATUS.OK);
  });
};

/**
 * Add Task Comment
 */
exports.addTaskComment = (req, res) => {
  const { taskId } = req.params;

  // ✅ FIXED (important)
  const user_id = req.user.user_id;

  const { content } = req.body;

  const sql = `
    INSERT INTO task_comments (task_id, user_id, content)
    VALUES (?, ?, ?)
  `;

  pool.query(sql, [taskId, user_id, content], (err, result) => {
    if (err) return sendError(res, 500, 'DB_ERROR', err.message);

    // ✅ FIXED ORDER
    sendSuccess(
      res,
      {
        id: result.insertId,
        task_id: taskId,
        user_id,
        content,
      },
      'Comment added',
      HTTP_STATUS.CREATED
    );
  });
};

/**
 * Get Task Comments
 */
exports.getTaskComments = (req, res) => {
  const { taskId } = req.params;

  const sql = `
    SELECT tc.*, u.name, u.email
    FROM task_comments tc
    JOIN users u ON tc.user_id = u.id
    WHERE tc.task_id = ?
    ORDER BY tc.created_at DESC
  `;

  pool.query(sql, [taskId], (err, results) => {
    if (err) return sendError(res, 500, 'DB_ERROR', err.message);

    // ✅ FIXED
    sendSuccess(res, results, 'Comments fetched', HTTP_STATUS.OK);
  });
};

/**
 * Delete Task Comment
 */
exports.deleteTaskComment = (req, res) => {
  const { commentId } = req.params;

  const sql = `DELETE FROM task_comments WHERE id = ?`;

  pool.query(sql, [commentId], (err) => {
    if (err) return sendError(res, 500, 'DB_ERROR', err.message);

    // ✅ FIXED
    sendSuccess(res, null, 'Comment deleted', HTTP_STATUS.OK);
  });
};