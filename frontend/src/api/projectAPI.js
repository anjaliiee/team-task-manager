import api from './authAPI';

/**
 * 🔥 CREATE PROJECT
 */
export const createProject = async (data) => {
  try {
    const response = await api.post('/projects', {
      name: data.name,
      description: data.description || ""
    });

    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 🔥 GET ALL PROJECTS
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
 * 🔥 GET PROJECT DETAILS
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
 * 🔥 UPDATE PROJECT
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
 * 🔥 DELETE PROJECT
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
 * 🔥 MEMBERS
 */
export const addProjectMember = async (projectId, userId, role) => {
  try {
    const response = await api.post(`/projects/${projectId}/members`, {
      user_id: userId,
      role
    });

    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getProjectMembers = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}/members`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const removeProjectMember = async (projectId, userId) => {
  try {
    await api.delete(`/projects/${projectId}/members/${userId}`);
    return true;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateMemberRole = async (projectId, userId, role) => {
  try {
    const response = await api.put(
      `/projects/${projectId}/members/${userId}`,
      { role }
    );

    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 🔥 INVITE MEMBER (NEW)
 */
export const inviteMember = async (projectId, data) => {
  try {
    const response = await api.post(`/projects/${projectId}/invite`, {
      name: data.name,
      email: data.email
    });

    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 🔥 TASKS
 */

// CREATE TASK
export const createTask = async (projectId, data) => {
  try {
    const response = await api.post(
      `/projects/${projectId}/tasks`,
      data
    );

    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// GET TASKS
export const getProjectTasks = async (projectId) => {
  try {
    const response = await api.get(
      `/projects/${projectId}/tasks`
    );

    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// UPDATE TASK
export const updateTask = async (projectId, taskId, data) => {
  try {
    const response = await api.put(
      `/projects/${projectId}/tasks/${taskId}`,
      data
    );

    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 🔥 UPDATE STATUS
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

// DELETE TASK
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

/**
 * 🔥 TEAM TASKS (dashboard)
 */
export const getTeamTasks = async () => {
  try {
    const response = await api.get('/projects');
    const projects = response.data.data;

    let allTasks = [];

    for (let p of projects) {
      const res = await api.get(`/projects/${p.id}/tasks`);
      allTasks = [...allTasks, ...(res.data.data || [])];
    }

    return allTasks;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 🔥 DEFAULT EXPORT
 */
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
  inviteMember,
  createTask,
  getProjectTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTeamTasks
};