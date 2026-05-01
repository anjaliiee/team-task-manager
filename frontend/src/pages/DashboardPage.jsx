import React, { useEffect, useState } from 'react';
import {
  getSummary,
  getOverdueTasks,
  getMyTasks,
} from '../api/dashboardAPI';

const DashboardPage = () => {
  const [summary, setSummary] = useState({
    todo: 0,
    in_progress: 0,
    completed: 0,
  });

  const [overdue, setOverdue] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, o, m] = await Promise.all([
          getSummary(),
          getOverdueTasks(),
          getMyTasks(),
        ]);

        setSummary(s);
        setOverdue(o);
        setMyTasks(m);
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">Todo</p>
          <p className="text-2xl font-bold">{summary.todo}</p>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">In Progress</p>
          <p className="text-2xl font-bold">{summary.in_progress}</p>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">Completed</p>
          <p className="text-2xl font-bold">{summary.completed}</p>
        </div>
      </div>

      {/* MY TASKS */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">My Tasks</h2>

        {myTasks.length === 0 ? (
          <p className="text-gray-500">No assigned tasks</p>
        ) : (
          <div className="space-y-3">
            {myTasks.map((task) => (
              <div
                key={task.id}
                className="border p-3 rounded flex justify-between"
              >
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-500">
                    Due: {task.due_date || 'N/A'}
                  </p>
                </div>

                <span className={`text-sm px-2 py-1 rounded ${
                  task.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : task.status === 'in_progress'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* OVERDUE TASKS */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4 text-red-600">
          Overdue Tasks
        </h2>

        {overdue.length === 0 ? (
          <p className="text-gray-500">No overdue tasks 🎉</p>
        ) : (
          <div className="space-y-3">
            {overdue.map((task) => (
              <div
                key={task.id}
                className="border p-3 rounded bg-red-50"
              >
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-gray-500">
                  Due: {task.due_date}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;