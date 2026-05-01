const bcrypt = require('bcryptjs');
const env = require('../config/env');

// Hash password
exports.hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, env.BCRYPT.ROUNDS);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error.message);
    throw error;
  }
};

// Compare password
exports.comparePassword = async (plainPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Error comparing password:', error.message);
    throw error;
  }
};
