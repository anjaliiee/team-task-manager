import api from './authAPI';

/**
 * Get all tasks for a project
 */
export const getTasks = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}/tasks`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create task
 */
export const createTask = async (projectId, data) => {
  try {
    const response = await api.post(`/projects/${projectId}/tasks`, data);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update task status
 */
export const updateTaskStatus = async (projectId, taskId, status) => {
  try {
    const response = await api.patch(
      `/projects/${projectId}/tasks/${taskId}/status`,
      { status }
    );
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete task
 */
export const deleteTask = async (projectId, taskId) => {
  try {
    const response = await api.delete(
      `/projects/${projectId}/tasks/${taskId}`
    );
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};