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

  pool.query(
    sql,
    [title, description, project_id, assignee_id, due_date],
    (error, results) => {
      if (error) {
        logger.error('createTask error', { error: error.message });
        return callback(error, null);
      }

      getTaskById(results.insertId, callback); // 🔥 return full task
    }
  );
};

/**
 * GET TASK BY ID
 */
const getTaskById = (id, callback) => {
  const sql = `
    SELECT t.*, u.name AS assignee_name
    FROM tasks t
    LEFT JOIN users u ON t.assignee_id = u.id
    WHERE t.id = ? AND t.deleted_at IS NULL
  `;

  pool.query(sql, [id], (error, results) => {
    if (error) {
      logger.error('getTaskById error', { error: error.message });
      return callback(error, null);
    }

    callback(null, results[0] || null);
  });
};

/**
 * GET PROJECT TASKS
 */
const getProjectTasks = (project_id, filters = {}, callback) => {
  let sql = `
    SELECT t.*, u.name AS assignee_name
    FROM tasks t
    LEFT JOIN users u ON t.assignee_id = u.id
    WHERE t.project_id = ? AND t.deleted_at IS NULL
  `;

  const values = [project_id];

  if (filters.status) {
    sql += ' AND t.status = ?';
    values.push(filters.status);
  }

  if (filters.assignee_id) {
    sql += ' AND t.assignee_id = ?';
    values.push(filters.assignee_id);
  }

  if (filters.due_date_from) {
    sql += ' AND t.due_date >= ?';
    values.push(filters.due_date_from);
  }

  if (filters.due_date_to) {
    sql += ' AND t.due_date <= ?';
    values.push(filters.due_date_to);
  }

  // 🔥 SAFE SORTING
  const allowedSort = ['due_date', 'created_at', 'status'];
  const sort = allowedSort.includes(filters.sort) ? filters.sort : 'created_at';
  const order = filters.order === 'desc' ? 'DESC' : 'ASC';

  sql += ` ORDER BY t.${sort} ${order}`;

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
    UPDATE tasks
    SET title = ?, description = ?, assignee_id = ?, due_date = ?, updated_at = NOW()
    WHERE id = ?
  `;

  pool.query(sql, [title, description, assignee_id, due_date, id], (error) => {
    if (error) {
      logger.error('updateTask error', { error: error.message });
      return callback(error, null);
    }

    getTaskById(id, callback); // 🔥 return updated task
  });
};

/**
 * UPDATE TASK STATUS
 */
const updateTaskStatus = (id, status, callback) => {
  const sql = `
    UPDATE tasks 
    SET status = ?, updated_at = NOW() 
    WHERE id = ?
  `;

  pool.query(sql, [status, id], (error) => {
    if (error) {
      logger.error('updateTaskStatus error', { error: error.message });
      return callback(error, null);
    }

    getTaskById(id, callback); // 🔥 return full task
  });
};

/**
 * DELETE TASK (SOFT DELETE)
 */
const deleteTask = (id, callback) => {
  const sql = 'UPDATE tasks SET deleted_at = NOW() WHERE id = ?';

  pool.query(sql, [id], (error) => {
    if (error) {
      logger.error('deleteTask error', { error: error.message });
      return callback(error, null);
    }

    callback(null, { id });
  });
};

/**
 * GET OVERDUE TASKS (OPTIONAL BUT POWERFUL)
 */
const getOverdueTasks = (user_id, callback) => {
  const sql = `
    SELECT t.*, u.name AS assignee_name
    FROM tasks t
    LEFT JOIN users u ON t.assignee_id = u.id
    WHERE 
      (t.assignee_id = ? OR EXISTS (
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
      logger.error('getOverdueTasks error', { error: error.message });
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