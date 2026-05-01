const mysql = require('mysql2');
const env = require('./env');

// Create connection pool
const pool = mysql.createPool({
  host: env.DB.HOST,
  port: env.DB.PORT,
  user: env.DB.USER,
  password: env.DB.PASSWORD,
  database: env.DB.DATABASE,
  waitForConnections: true,
  connectionLimit: env.DB.POOL_LIMIT,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ER_AUTHENTICATION_PLUGIN_ERROR') {
      console.error('Database authentication failed.');
    }
  } else {
    if (connection) {
      connection.release();
      console.log('✓ Database connection established');
    }
  }
});

module.exports = pool;
