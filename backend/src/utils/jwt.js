const jwt = require('jsonwebtoken');
const env = require('../config/env');

// Generate JWT Token
exports.generateToken = (payload, expiresIn = env.JWT.EXPIRY) => {
  try {
    const token = jwt.sign(payload, env.JWT.SECRET, {
      expiresIn,
      issuer: 'Team Task Manager',
      algorithm: 'HS256',
    });
    return token;
  } catch (error) {
    console.error('Error generating token:', error.message);
    throw error;
  }
};

// Verify JWT Token
exports.verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, env.JWT.SECRET);
    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error.message);
    throw error;
  }
};

// Generate Refresh Token
exports.generateRefreshToken = (payload) => {
  try {
    const token = jwt.sign(payload, env.JWT.REFRESH_SECRET, {
      expiresIn: env.JWT.REFRESH_EXPIRY,
      issuer: 'Team Task Manager',
      algorithm: 'HS256',
    });
    return token;
  } catch (error) {
    console.error('Error generating refresh token:', error.message);
    throw error;
  }
};

// Verify Refresh Token
exports.verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, env.JWT.REFRESH_SECRET);
    return decoded;
  } catch (error) {
    console.error('Error verifying refresh token:', error.message);
    throw error;
  }
};

// Decode token without verification (for debugging)
exports.decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error('Error decoding token:', error.message);
    throw error;
  }
};
