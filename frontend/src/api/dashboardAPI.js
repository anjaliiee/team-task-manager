import api from './authAPI';

/**
 * 🔥 DASHBOARD SUMMARY
 */
export const getSummary = async () => {
  try {
    const res = await api.get('/dashboard/summary');
    return res.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 🔥 OVERDUE TASKS
 */
export const getOverdueTasks = async () => {
  try {
    const res = await api.get('/dashboard/tasks/overdue');
    return res.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 🔥 MY TASKS (optional, not used now)
 */
export const getMyTasks = async () => {
  try {
    const res = await api.get('/dashboard/tasks/assigned-to-me');
    return res.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 🔥 TEAM TASKS (all tasks from all projects)
 */
export const getTeamTasks = async () => {
  try {
    const projectsRes = await api.get('/projects');
    const projects = projectsRes.data.data || [];

    let allTasks = [];

    for (let project of projects) {
      try {
        const res = await api.get(`/projects/${project.id}/tasks`);
        const tasks = res.data.data || [];

        allTasks = [...allTasks, ...tasks];
      } catch (err) {
        console.error(`Error loading tasks for project ${project.id}`, err);
      }
    }

    return allTasks;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 🔥 UPDATE TASK STATUS (THIS FIXES YOUR ERROR)
 */
export const updateTaskStatus = async (projectId, taskId, status) => {
  try {
    const res = await api.patch(
      `/projects/${projectId}/tasks/${taskId}/status`,
      { status }
    );

    return res.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};