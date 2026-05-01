const pool = require('../config/database');
const logger = require('../utils/logger');

// Add project member
const addProjectMember = (memberData, callback) => {
  const { project_id, user_id, role } = memberData;

  const sql = `
    INSERT INTO project_members (project_id, user_id, role)
    VALUES (?, ?, ?)
  `;

  pool.query(sql, [project_id, user_id, role], (error, results) => {
    if (error) {
      logger.error('addProjectMember error', { project_id, user_id, error: error.message });
      return callback(error, null);
    }

    callback(null, {
      id: results.insertId,
      project_id,
      user_id,
      role,
    });
  });
};

// Get project members
const getProjectMembers = (project_id, callback) => {
  const sql = `
    SELECT u.id, u.name, u.email, pm.role, pm.joined_at
    FROM users u
    JOIN project_members pm ON u.id = pm.user_id
    WHERE pm.project_id = ?
    ORDER BY pm.joined_at DESC
  `;

  pool.query(sql, [project_id], (error, results) => {
    if (error) {
      logger.error('getProjectMembers error', { project_id, error: error.message });
      return callback(error, null);
    }

    callback(null, results || []);
  });
};

// Check if user is project member (ALREADY GOOD)
const isProjectMember = (project_id, user_id, callback) => {
  const sql = `
    SELECT role 
    FROM project_members 
    WHERE project_id = ? AND user_id = ?
  `;

  pool.query(sql, [project_id, user_id], (error, results) => {
    if (error) {
      logger.error('isProjectMember error', { project_id, user_id, error: error.message });
      return callback(error, null);
    }

    callback(null, results.length > 0 ? results[0] : null);
  });
};

// ✅ NEW: Get user role (THIS FIXES YOUR CRASH)
const getUserProjectRole = (project_id, user_id, callback) => {
  const sql = `
    SELECT role 
    FROM project_members 
    WHERE project_id = ? AND user_id = ?
  `;

  pool.query(sql, [project_id, user_id], (error, results) => {
    if (error) {
      logger.error('getUserProjectRole error', { project_id, user_id, error: error.message });
      return callback(error, null);
    }

    callback(null, results.length > 0 ? results[0] : null);
  });
};

// Remove project member
const removeProjectMember = (project_id, user_id, callback) => {
  const sql = `
    DELETE FROM project_members 
    WHERE project_id = ? AND user_id = ?
  `;

  pool.query(sql, [project_id, user_id], (error) => {
    if (error) {
      logger.error('removeProjectMember error', { project_id, user_id, error: error.message });
      return callback(error, null);
    }

    callback(null, { project_id, user_id });
  });
};

// Update member role
const updateMemberRole = (project_id, user_id, role, callback) => {
  const sql = `
    UPDATE project_members 
    SET role = ? 
    WHERE project_id = ? AND user_id = ?
  `;

  pool.query(sql, [role, project_id, user_id], (error) => {
    if (error) {
      logger.error('updateMemberRole error', { project_id, user_id, error: error.message });
      return callback(error, null);
    }

    callback(null, { project_id, user_id, role });
  });
};

module.exports = {
  addProjectMember,
  getProjectMembers,
  isProjectMember,
  getUserProjectRole, 
  removeProjectMember,
  updateMemberRole,
};