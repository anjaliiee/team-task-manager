// Frontend Configuration

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const APP_NAME = process.env.REACT_APP_NAME || 'Team Task Manager';

export const config = {
  API_URL,
  APP_NAME,
  // Token storage keys
  TOKEN_KEY: 'token',
  USER_KEY: 'user',
  // Request timeout
  REQUEST_TIMEOUT: 30000,
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

export default config;
