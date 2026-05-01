const pool = require('../config/database');
const logger = require('../utils/logger');

// Get user by ID
const getUserById = (id, callback) => {
  const sql = 'SELECT id, name, email, created_at FROM users WHERE id = ?';
  pool.query(sql, [id], (error, results) => {
    if (error) {
      logger.error('getUserById error', { id, error: error.message });
      return callback(error, null);
    }
    callback(null, results.length > 0 ? results[0] : null);
  });
};

// Get user by email
const getUserByEmail = (email, callback) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  pool.query(sql, [email], (error, results) => {
    if (error) {
      logger.error('getUserByEmail error', { email, error: error.message });
      return callback(error, null);
    }
    callback(null, results.length > 0 ? results[0] : null);
  });
};

// Create user
const createUser = (userData, callback) => {
  const { name, email, password_hash } = userData;
  const sql = 'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)';
  pool.query(sql, [name, email, password_hash], (error, results) => {
    if (error) {
      logger.error('createUser error', { email, error: error.message });
      return callback(error, null);
    }
    callback(null, { id: results.insertId, name, email });
  });
};

// Update user
const updateUser = (id, userData, callback) => {
  const fields = [];
  const values = [];

  Object.keys(userData).forEach((key) => {
    if (userData[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(userData[key]);
    }
  });

  if (fields.length === 0) {
    return callback(null, null);
  }

  values.push(id);
  const sql = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;

  pool.query(sql, values, (error, results) => {
    if (error) {
      logger.error('updateUser error', { id, error: error.message });
      return callback(error, null);
    }
    callback(null, { id, ...userData });
  });
};

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
};
