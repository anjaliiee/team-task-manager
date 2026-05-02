import React, { useEffect, useState } from 'react';
import {
  getSummary,
  getOverdueTasks,
  getTeamTasks,
  updateTaskStatus
} from '../api/dashboardAPI';

import {
  getAllProjects,
  createTask
} from '../api/projectAPI';

const DashboardPage = () => {
  const [summary, setSummary] = useState({});
  const [overdue, setOverdue] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  // 🔥 MODAL STATE
  const [showModal, setShowModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedProject, setSelectedProject] = useState('');

  // 🔥 LOAD DATA
  useEffect(() => {
    const load = async () => {
      try {
        const [s, o, t, p] = await Promise.all([
          getSummary(),
          getOverdueTasks(),
          getTeamTasks(),
          getAllProjects()
        ]);

        setSummary(s || {});
        setOverdue(o || []);
        setTeamTasks(t || []);
        setProjects(p || []);
      } catch (err) {
        console.error("🔥 Load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // 🔥 CREATE TASK
  const handleCreateTask = async () => {
    if (!taskTitle || !selectedProject) return;

    try {
      const newTask = await createTask(selectedProject, {
        title: taskTitle,
        description: '',
        assignee_id: null
      });

      // instant UI update
      setTeamTasks(prev => [newTask, ...prev]);

      setShowModal(false);
      setTaskTitle('');
      setSelectedProject('');
    } catch (err) {
      console.error("🔥 Create task error:", err);
    }
  };

  // 🔥 STATUS TOGGLE
  const handleToggleStatus = async (task) => {
    let newStatus;

    if (task.status === 'todo') newStatus = 'in_progress';
    else if (task.status === 'in_progress') newStatus = 'completed';
    else newStatus = 'todo';

    try {
      await updateTaskStatus(task.project_id, task.id, newStatus);

      setTeamTasks(prev =>
        prev.map(t =>
          t.id === task.id ? { ...t, status: newStatus } : t
        )
      );

      // update summary
      setSummary(prev => {
        const updated = { ...prev };
        updated[task.status] = Math.max((updated[task.status] || 1) - 1, 0);
        updated[newStatus] = (updated[newStatus] || 0) + 1;
        return updated;
      });

    } catch (err) {
      console.error("🔥 Status update error:", err);
    }
  };

  // 🔥 BADGE STYLES
  const getStatusBadge = (status) => {
    switch (status) {
      case 'in_progress':
        return "bg-[#3A2C06] text-[#E4B84A]";
      case 'todo':
        return "bg-[#20194A] text-[#A394F0]";
      case 'completed':
        return "bg-[#1E8A4C] text-white";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1117] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1117] text-white px-6 py-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold">Dashboard</h1>
        <p className="text-[14px] text-[#8B8FA8]">
          Overview of your tasks
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-xl p-5">
          <p className="text-[12px] uppercase tracking-wide text-[#8B8FA8]">
            TODO
          </p>
          <p className="text-[40px] text-[#7B6EF5]">
            {summary.todo || 0}
          </p>
        </div>

        <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-xl p-5">
          <p className="text-[12px] uppercase tracking-wide text-[#8B8FA8]">
            IN PROGRESS
          </p>
          <p className="text-[40px] text-[#E2A320]">
            {summary.in_progress || 0}
          </p>
        </div>

        <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-xl p-5">
          <p className="text-[12px] uppercase tracking-wide text-[#8B8FA8]">
            COMPLETED
          </p>
          <p className="text-[40px] text-[#2ECC8A]">
            {summary.completed || 0}
          </p>
        </div>

      </div>

      {/* MAIN */}
      <div className="grid grid-cols-5 gap-4">

        {/* OVERDUE */}
        <div className="col-span-2 bg-[#1A1D27] border border-[#2A2D3A] rounded-xl">

          <div className="flex justify-between items-center px-5 py-4 border-b border-[#2A2D3A]">
            <h2>Overdue tasks</h2>
            <span className="text-xs px-2 py-1 bg-[#2A2D3A] rounded">
              {overdue.length}
            </span>
          </div>

          {overdue.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-[#8B8FA8] mb-2">No overdue tasks</p>
              <span className="bg-[#1E8A4C] px-3 py-1 rounded text-sm">
                All caught up
              </span>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {overdue.map(task => (
                <div key={task.id}>{task.title}</div>
              ))}
            </div>
          )}

        </div>

        {/* TEAM TASKS */}
        <div className="col-span-3 bg-[#1A1D27] border border-[#2A2D3A] rounded-xl">

          <div className="flex justify-between items-center px-5 py-4 border-b border-[#2A2D3A]">

            <div className="flex gap-2">
              <h2>Team tasks</h2>
              <span className="text-xs px-2 py-1 bg-[#2A2D3A] rounded">
                {teamTasks.length}
              </span>
            </div>

            {/* 🔥 FIXED BUTTON */}
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-1 text-sm rounded-lg border border-[#2A2D3A] hover:bg-[#20222B]"
            >
              + Add task
            </button>

          </div>

          <div className="divide-y divide-[#2A2D3A]">

            {teamTasks.map(task => (
              <div key={task.id} className="flex justify-between items-center px-5 py-4">

                <div className="flex gap-3">

                  {/* CHECKBOX */}
                  <button
                    onClick={() => handleToggleStatus(task)}
                    className={`w-4 h-4 rounded-full border ${
                      task.status === 'completed'
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-500'
                    }`}
                  />

                  <div>
                    <p>{task.title}</p>
                    <p className="text-xs text-gray-400">
                      Project: {task.project_id}
                    </p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded text-xs ${getStatusBadge(task.status)}`}>
                  {task.status}
                </span>

              </div>
            ))}

          </div>

        </div>

      </div>

      {/* 🔥 MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

          <div className="bg-[#1A1D27] p-6 rounded-xl w-[400px]">

            <h2 className="mb-4">Create Task</h2>

            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Task title"
              className="w-full mb-3 p-2 bg-[#0F1117]"
            />

            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full mb-4 p-2 bg-[#0F1117]"
            >
              <option value="">Select project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={handleCreateTask}>Create</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardPage;