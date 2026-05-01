// Simple Logger Utility
const env = require('../config/env');

const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

const LOG_LEVEL_PRIORITY = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const currentLogLevel = LOG_LEVEL_PRIORITY[env.LOG_LEVEL.toUpperCase()] || 1;

const formatLog = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  let log = `[${timestamp}] [${level}] ${message}`;
  if (data) {
    log += ` ${JSON.stringify(data)}`;
  }
  return log;
};

module.exports = {
  debug: (message, data) => {
    if (LOG_LEVEL_PRIORITY.DEBUG >= currentLogLevel) {
      console.log(formatLog(LOG_LEVELS.DEBUG, message, data));
    }
  },

  info: (message, data) => {
    if (LOG_LEVEL_PRIORITY.INFO >= currentLogLevel) {
      console.log(formatLog(LOG_LEVELS.INFO, message, data));
    }
  },

  warn: (message, data) => {
    if (LOG_LEVEL_PRIORITY.WARN >= currentLogLevel) {
      console.warn(formatLog(LOG_LEVELS.WARN, message, data));
    }
  },

  error: (message, data) => {
    if (LOG_LEVEL_PRIORITY.ERROR >= currentLogLevel) {
      console.error(formatLog(LOG_LEVELS.ERROR, message, data));
    }
  },
};
