import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Signup - Register new user
 */
export const signup = async (name, email, password) => {
  try {
    const response = await api.post('/auth/signup', { name, email, password });
    if (response.data.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.data));
    }
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Login - Authenticate user
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.data));
    }
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Logout - Clear authentication
 */
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

/**
 * Refresh Token - Get new access token
 */
export const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh');
    const token = response.data.data.token;
    localStorage.setItem(TOKEN_KEY, token);
    return token;
  } catch (error) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    throw error;
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Get token from storage
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const response = await api.put(`/users/${userId}`, updates);
    const updatedUser = response.data.data;
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Change password
 */
export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const response = await api.put(`/users/${userId}/password`, {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default api;
