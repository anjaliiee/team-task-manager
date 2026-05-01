import api from './authAPI';

export const getSummary = async () => {
  const res = await api.get('/dashboard/summary');
  return res.data.data;
};

export const getOverdueTasks = async () => {
  const res = await api.get('/dashboard/tasks/overdue');
  return res.data.data;
};

export const getMyTasks = async () => {
  const res = await api.get('/dashboard/tasks/assigned-to-me');
  return res.data.data;
};