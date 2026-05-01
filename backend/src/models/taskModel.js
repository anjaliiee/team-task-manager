const pool = require('../config/database');
const logger = require('../utils/logger');

// Create task
const createTask = (taskData, callback) => {
  const { title, description, project_id, assignee_id, due_date } = taskData;
  const sql = `
    INSERT INTO tasks (title, description, project_id, assignee_id, due_date, status)
    VALUES (?, ?, ?, ?, ?, 'todo')
  `;
  pool.query(sql, [title, description, project_id, assignee_id, due_date], (error, results) => {
    if (error) {
      logger.error('createTask error', { project_id, error: error.message });
      return callback(error, null);
    }
    callback(null, { id: results.insertId, title, description, project_id, assignee_id, status: 'todo' });
  });
};

// Get task by ID
const getTaskById = (id, callback) => {
  const sql = 'SELECT * FROM tasks WHERE id = ? AND deleted_at IS NULL';
  pool.query(sql, [id], (error, results) => {
    if (error) {
      logger.error('getTaskById error', { id, error: error.message });
      return callback(error, null);
    }
    callback(null, results.length > 0 ? results[0] : null);
  });
};

// Get project tasks
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

  if (filters.due_date_from) {
    sql += ' AND due_date >= ?';
    values.push(filters.due_date_from);
  }

  if (filters.due_date_to) {
    sql += ' AND due_date <= ?';
    values.push(filters.due_date_to);
  }

  const order = filters.order === 'desc' ? 'DESC' : 'ASC';
  const sort = filters.sort || 'due_date';
  sql += ` ORDER BY ${sort} ${order}`;

  pool.query(sql, values, (error, results) => {
    if (error) {
      logger.error('getProjectTasks error', { project_id, error: error.message });
      return callback(error, null);
    }
    callback(null, results || []);
  });
};

// Update task
const updateTask = (id, taskData, callback) => {
  const { title, description, assignee_id, due_date } = taskData;
  const sql = `
    UPDATE tasks SET 
      title = ?, description = ?, assignee_id = ?, due_date = ?, updated_at = NOW()
    WHERE id = ?
  `;
  pool.query(sql, [title, description, assignee_id, due_date, id], (error, results) => {
    if (error) {
      logger.error('updateTask error', { id, error: error.message });
      return callback(error, null);
    }
    callback(null, { id, ...taskData });
  });
};

// Update task status
const updateTaskStatus = (id, status, callback) => {
  const sql = 'UPDATE tasks SET status = ?, updated_at = NOW() WHERE id = ?';
  pool.query(sql, [status, id], (error, results) => {
    if (error) {
      logger.error('updateTaskStatus error', { id, error: error.message });
      return callback(error, null);
    }
    callback(null, { id, status });
  });
};

// Soft delete task
const deleteTask = (id, callback) => {
  const sql = 'UPDATE tasks SET deleted_at = NOW() WHERE id = ?';
  pool.query(sql, [id], (error, results) => {
    if (error) {
      logger.error('deleteTask error', { id, error: error.message });
      return callback(error, null);
    }
    callback(null, { id });
  });
};

// Get overdue tasks for user
const getOverdueTasks = (user_id, callback) => {
  const sql = `
    SELECT t.* FROM tasks t
    WHERE (t.assignee_id = ? OR EXISTS (
      SELECT 1 FROM project_members pm
      WHERE pm.project_id = t.project_id AND pm.user_id = ? AND pm.role = 'admin'
    ))
    AND t.due_date < CURDATE()
    AND t.status != 'completed'
    AND t.deleted_at IS NULL
    ORDER BY t.due_date ASC
  `;
  pool.query(sql, [user_id, user_id], (error, results) => {
    if (error) {
      logger.error('getOverdueTasks error', { user_id, error: error.message });
      return callback(error, null);
    }
    callback(null, results || []);
  });
};

module.exports = {
  createTask,
  getTaskById,
  getProjectTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getOverdueTasks,
};
