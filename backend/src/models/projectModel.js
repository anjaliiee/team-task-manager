const pool = require('../config/database');
const logger = require('../utils/logger');

// Create project
const createProject = (projectData, callback) => {
  const { name, description, owner_id } = projectData;
  const sql = 'INSERT INTO projects (name, description, owner_id) VALUES (?, ?, ?)';
  pool.query(sql, [name, description, owner_id], (error, results) => {
    if (error) {
      logger.error('createProject error', { owner_id, error: error.message });
      return callback(error, null);
    }
    callback(null, { id: results.insertId, name, description, owner_id });
  });
};

// Get project by ID
const getProjectById = (id, callback) => {
  const sql = 'SELECT * FROM projects WHERE id = ? AND deleted_at IS NULL';
  pool.query(sql, [id], (error, results) => {
    if (error) {
      logger.error('getProjectById error', { id, error: error.message });
      return callback(error, null);
    }
    callback(null, results.length > 0 ? results[0] : null);
  });
};

// Get all projects for user
const getProjectsByUserId = (user_id, callback) => {
  const sql = `
    SELECT DISTINCT p.* FROM projects p
    JOIN project_members pm ON p.id = pm.project_id
    WHERE pm.user_id = ? AND p.deleted_at IS NULL
    ORDER BY p.created_at DESC
  `;
  pool.query(sql, [user_id], (error, results) => {
    if (error) {
      logger.error('getProjectsByUserId error', { user_id, error: error.message });
      return callback(error, null);
    }
    callback(null, results || []);
  });
};

// Update project
const updateProject = (id, projectData, callback) => {
  const { name, description } = projectData;
  const sql = 'UPDATE projects SET name = ?, description = ?, updated_at = NOW() WHERE id = ?';
  pool.query(sql, [name, description, id], (error, results) => {
    if (error) {
      logger.error('updateProject error', { id, error: error.message });
      return callback(error, null);
    }
    callback(null, { id, name, description });
  });
};

// Soft delete project
const deleteProject = (id, callback) => {
  const sql = 'UPDATE projects SET deleted_at = NOW() WHERE id = ?';
  pool.query(sql, [id], (error, results) => {
    if (error) {
      logger.error('deleteProject error', { id, error: error.message });
      return callback(error, null);
    }
    callback(null, { id });
  });
};

module.exports = {
  createProject,
  getProjectById,
  getProjectsByUserId,
  updateProject,
  deleteProject,
};
