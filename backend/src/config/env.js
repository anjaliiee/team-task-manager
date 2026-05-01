require('dotenv').config();

module.exports = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_URL: process.env.API_URL || 'http://localhost:5000',

  // Database
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: process.env.DB_PORT || 3306,
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || 'password',
    DATABASE: process.env.DB_NAME || 'team_task_manager',
    POOL_LIMIT: parseInt(process.env.DB_POOL_LIMIT) || 10,
  },

  // JWT
  JWT: {
    SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production',
    EXPIRY: process.env.JWT_EXPIRY || '1h',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key_change_in_production',
    REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',
  },

  // CORS
  CORS: {
    ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },

  // Bcrypt
  BCRYPT: {
    ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 10,
  },

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
};
