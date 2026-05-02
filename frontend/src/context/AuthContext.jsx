import React, { createContext, useState, useCallback, useEffect } from 'react';
import * as authAPI from '../api/authAPI';

export const AuthContext = createContext(null);

/**
 * Helper: Extract error message from various error types
 */
const getErrorMessage = (err) => {
  if (typeof err === 'string') return err;
  if (err?.message) return err.message;
  if (err?.error) return err.error;
  if (err?.msg) return err.msg;
  if (typeof err === 'object') {
    try {
      return JSON.stringify(err);
    } catch {
      return 'An error occurred';
    }
  }
  return 'An error occurred';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const savedToken = authAPI.getToken();
    const savedUser = authAPI.getCurrentUser();
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    
    setIsLoading(false);
  }, []);

  /**
   * Handle signup
   */
  const signup = useCallback(async (name, email, password) => {
    try {
      setError(null);
      setIsLoading(true);
      const userData = await authAPI.signup(name, email, password);
      setToken(userData.token);
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle login
   */
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      setIsLoading(true);
      const userData = await authAPI.login(email, password);
      setToken(userData.token);
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle logout
   */
  const logout = useCallback(async () => {
    try {
      setError(null);
      await authAPI.logout();
      setToken(null);
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (updates) => {
    try {
      setError(null);
      setIsLoading(true);
      const updatedUser = await authAPI.updateUserProfile(user.user_id, updates);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  /**
   * Change password
   */
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      setError(null);
      setIsLoading(true);
      await authAPI.changePassword(user.user_id, currentPassword, newPassword);
      return true;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const value = {
    user,
    token,
    isLoading,
    error,
    isAuthenticated: !!token,
    signup,
    login,
    logout,
    clearError,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
