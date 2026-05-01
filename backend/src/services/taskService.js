const pool = require('../config/database');
const logger = require('../utils/logger');

/**
 * CREATE TASK
 */
const createTask = (taskData, callback) => {
  const { title, description, project_id, assignee_id, due_date } = taskData;

  const sql = `
    INSERT INTO tasks (title, description, project_id, assignee_id, due_date, status)
    VALUES (?, ?, ?, ?, ?, 'todo')
  `;

  pool.query(sql, [title, description, project_id, assignee_id, due_date], (error, results) => {
    if (error) {
      logger.error('createTask error', { error: error.message });
      return callback(error, null);
    }

    callback(null, {
      id: results.insertId,
      title,
      description,
      project_id,
      assignee_id,
      due_date,
      status: 'todo'
    });
  });
};

/**
 * GET TASKS
 */
const getProjectTasks = (project_id, filters = {}, callback) => {
  let sql = 'SELECT * FROM tasks WHERE project_id = ? AND deleted_at IS NULL';
  const values = [project_id];

  if (filters.status) {
    sql += ' AND status = ?';
    values.push(filters.status);
  }

  if (filters.assignee_id) {
    sql += ' AND assignee_id = ?';
    values.push(filters.assignee_id);
  }

  sql += ' ORDER BY created_at DESC';

  pool.query(sql, values, (error, results) => {
    if (error) {
      logger.error('getProjectTasks error', { error: error.message });
      return callback(error, null);
    }

    callback(null, results || []);
  });
};

/**
 * UPDATE TASK
 */
const updateTask = (id, taskData, callback) => {
  const { title, description, assignee_id, due_date } = taskData;

  const sql = `
    UPDATE tasks SET 
      title = ?, description = ?, assignee_id = ?, due_date = ?, updated_at = NOW()
    WHERE id = ?
  `;

  pool.query(sql, [title, description, assignee_id, due_date, id], (error) => {
    if (error) {
      logger.error('updateTask error', { error: error.message });
      return callback(error, null);
    }

    callback(null, { id, ...taskData });
  });
};

/**
 * DELETE TASK (soft delete)
 */
const deleteTask = (id, callback) => {
  const sql = 'UPDATE tasks SET deleted_at = NOW() WHERE id = ?';

  pool.query(sql, [id], (error) => {
    if (error) {
      logger.error('deleteTask error', { error: error.message });
      return callback(error, null);
    }

    callback(null);
  });
};

module.exports = {
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask
};