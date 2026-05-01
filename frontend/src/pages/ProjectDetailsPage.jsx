import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { AddMemberModal } from '../components/AddMemberModal';
import {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask
} from '../api/taskAPI';

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    currentProject,
    members,
    getProjectDetails,
    fetchProjectMembers,
    removeMember,
    deleteProject,
    isLoading,
    error,
  } = useProject();

  const [showAddMember, setShowAddMember] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  // ================================
  // LOAD DATA
  // ================================
  const loadProject = useCallback(async () => {
    try {
      await getProjectDetails(projectId);
      await fetchProjectMembers(projectId);
    } catch (err) {
      console.error(err);
    }
  }, [projectId]);

  const loadTasks = useCallback(async () => {
    try {
      const data = await getTasks(projectId);
      setTasks(data.tasks || data);
    } catch (err) {
      console.error(err);
    }
  }, [projectId]);

  useEffect(() => {
    loadProject();
    loadTasks();
  }, [loadProject, loadTasks]);

  // ================================
  // TASK HANDLERS (OPTIMIZED)
  // ================================
  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const newTask = await createTask(projectId, {
        title: newTaskTitle,
        description: newTaskDesc,
      });

      setTasks(prev => [newTask, ...prev]);

      setNewTaskTitle('');
      setNewTaskDesc('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      const updated = await updateTaskStatus(projectId, taskId, status);

      setTasks(prev =>
        prev.map(t => (t.id === taskId ? updated : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(projectId, taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  // ================================
  // MEMBER ACTIONS
  // ================================
  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Remove this member?')) return;

    await removeMember(projectId, memberId);
    fetchProjectMembers(projectId);
  };

  const handleDeleteProject = async () => {
    await deleteProject(projectId);
    navigate('/projects');
  };

  const isAdmin = members.find(
    m => m.user_id === user?.user_id && m.role === 'admin'
  );

  // ================================
  // UI
  // ================================
  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-white shadow-sm p-6">
        <Link to="/projects" className="text-sm text-gray-500">← Projects</Link>

        <h1 className="text-2xl font-bold mt-2">
          {currentProject?.name}
        </h1>

        {/* ✅ DESCRIPTION RESTORED */}
        {currentProject?.description && (
          <p className="text-gray-500 mt-1">
            {currentProject.description}
          </p>
        )}
      </div>

      <div className="max-w-6xl mx-auto p-6">

        {/* CREATE TASK */}
        <div className="bg-white p-4 rounded mb-6">
          <h3 className="font-semibold mb-3">Create Task</h3>

          <input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Task title"
            className="border p-2 w-full mb-2"
          />

          <textarea
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
            placeholder="Task description"
            className="border p-2 w-full mb-2"
          />

          <button
            onClick={handleCreateTask}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Task
          </button>
        </div>

        {/* TASK LIST */}
        <div className="bg-white p-4 rounded">
          <h3 className="font-semibold mb-3">Tasks</h3>

          {tasks.map(task => (
            <div key={task.id} className="border p-3 mb-3 rounded">

              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{task.title}</p>

                  {/* ✅ DESCRIPTION RESTORED */}
                  {task.description && (
                    <p className="text-sm text-gray-500">
                      {task.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>

              <select
                value={task.status}
                onChange={(e) =>
                  handleStatusChange(task.id, e.target.value)
                }
                className="mt-2 border p-1"
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* MODALS */}
      {showAddMember && (
        <AddMemberModal
          projectId={projectId}
          onClose={() => setShowAddMember(false)}
          onSuccess={() => fetchProjectMembers(projectId)}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded">
            <p>Delete project?</p>

            <button
              onClick={handleDeleteProject}
              className="bg-red-600 text-white px-4 py-2 mt-2"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsPage;