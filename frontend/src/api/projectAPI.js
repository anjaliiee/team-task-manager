import api from './authAPI';

/**
 * Create a new project
 */
export const createProject = async (name, description) => {
  try {
    const response = await api.post('/projects', { name, description });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get all projects for current user
 */
export const getAllProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get project details
 */
export const getProjectDetails = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update project
 */
export const updateProject = async (projectId, name, description) => {
  try {
    const response = await api.put(`/projects/${projectId}`, { name, description });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete project
 */
export const deleteProject = async (projectId) => {
  try {
    await api.delete(`/projects/${projectId}`);
    return true;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Add member to project
 */
export const addProjectMember = async (projectId, userId, role) => {
  try {
    const response = await api.post(`/projects/${projectId}/members`, { user_id: userId, role });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get project members
 */
export const getProjectMembers = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}/members`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Remove project member
 */
export const removeProjectMember = async (projectId, userId) => {
  try {
    await api.delete(`/projects/${projectId}/members/${userId}`);
    return true;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update member role
 */
export const updateMemberRole = async (projectId, userId, role) => {
  try {
    const response = await api.put(`/projects/${projectId}/members/${userId}`, { role });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  createProject,
  getAllProjects,
  getProjectDetails,
  updateProject,
  deleteProject,
  addProjectMember,
  getProjectMembers,
  removeProjectMember,
  updateMemberRole,
};
