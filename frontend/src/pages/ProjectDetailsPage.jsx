import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import {
  getProjectDetails,
  getProjectMembers,
  createTask,
  updateTaskStatus,
  deleteTask,
  inviteMember,
  getProjectTasks
} from '../api/projectAPI';

const statusMap = {
  todo: "Todo",
  in_progress: "In Progress",
  completed: "Completed"
};

const columns = ['todo', 'in_progress', 'completed'];

const ProjectDetailsPage = () => {
  const { projectId } = useParams();

  const [project, setProject] = useState({});
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [dueDate, setDueDate] = useState('');

  // ✅ DEFINE BEFORE useEffect
  const loadData = async () => {
    try {
      setLoading(true);

      const [p, m, t] = await Promise.all([
        getProjectDetails(projectId),
        getProjectMembers(projectId),
        getProjectTasks(projectId)
      ]);

      setProject(p || {});
      setMembers(m || []);
      setTasks(t || []);
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ THEN USE
  useEffect(() => {
    if (projectId) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // INVITE
  const handleInvite = async () => {
    if (!inviteEmail) return;

    await inviteMember(projectId, {
      name: inviteName,
      email: inviteEmail
    });

    setInviteName('');
    setInviteEmail('');
    loadData();
  };

  // CREATE TASK
  const handleCreateTask = async () => {
    if (!newTaskTitle) return;

    const newTask = await createTask(projectId, {
      title: newTaskTitle,
      description: newTaskDesc,
      assignee_id: selectedUser || null,
      due_date: dueDate || null
    });

    setTasks(prev => [newTask, ...prev]);

    setNewTaskTitle('');
    setNewTaskDesc('');
    setSelectedUser('');
    setDueDate('');
  };

  // DELETE
  const handleDeleteTask = async (taskId) => {
    await deleteTask(projectId, taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // DRAG DROP
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const taskId = String(result.draggableId);
    const newStatus = result.destination.droppableId;

    try {
      await updateTaskStatus(projectId, taskId, newStatus);

      setTasks(prev =>
        prev.map(t =>
          String(t.id) === taskId
            ? { ...t, status: newStatus }
            : t
        )
      );
    } catch (err) {
      console.error("Drag update failed:", err);
    }
  };

  const grouped = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed')
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <h1 className="text-2xl font-semibold mb-6">
        {project?.name || 'Project'}
      </h1>

      {/* FORMS */}
      <div className="grid grid-cols-2 gap-6 mb-8">

        {/* INVITE */}
        <div className="bg-[#1A1D27] border border-[#2A2D3A] p-5 rounded-xl">
          <h3 className="mb-4 text-sm text-[#8B8FA8]">Add Member</h3>

          <input
            placeholder="Name"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
            className="w-full mb-3 p-2 bg-[#0F1117] border border-[#2A2D3A] rounded"
          />

          <input
            placeholder="Email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="w-full mb-3 p-2 bg-[#0F1117] border border-[#2A2D3A] rounded"
          />

          <button
            onClick={handleInvite}
            className="bg-[#6C56EB] px-4 py-2 rounded text-sm"
          >
            Invite
          </button>
        </div>

        {/* CREATE TASK */}
        <div className="bg-[#1A1D27] border border-[#2A2D3A] p-5 rounded-xl">
          <h3 className="mb-4 text-sm text-[#8B8FA8]">Create Task</h3>

          <input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Title"
            className="w-full mb-2 p-2 bg-[#0F1117] border border-[#2A2D3A] rounded"
          />

          <textarea
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
            placeholder="Description"
            className="w-full mb-2 p-2 bg-[#0F1117] border border-[#2A2D3A] rounded"
          />

          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full mb-2 p-2 bg-[#0F1117] border border-[#2A2D3A] rounded"
          >
            <option value="">Assign user</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full mb-3 p-2 bg-[#0F1117] border border-[#2A2D3A] rounded"
          />

          <button
            onClick={handleCreateTask}
            className="bg-[#6C56EB] px-4 py-2 rounded text-sm"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* 🔥 KANBAN — ALWAYS MOUNTED */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-6">

          {columns.map(status => (
            <Droppable droppableId={status} key={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-[#1A1D27] border border-[#2A2D3A] rounded-xl p-4 min-h-[200px] transition
                    ${snapshot.isDraggingOver ? 'border-[#6C56EB] bg-[#181B24]' : ''}`}
                >
                  <h3 className="mb-4 font-medium text-sm text-[#8B8FA8]">
                    {statusMap[status]}
                  </h3>

                  {/* ⏳ Loading inside columns (not blocking DnD) */}
                  {loading && (
                    <p className="text-xs text-[#5A5E72]">Loading...</p>
                  )}

                  {!loading && grouped[status].length === 0 && (
                    <p className="text-xs text-[#5A5E72]">No tasks</p>
                  )}

                  {!loading && grouped[status].map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={String(task.id)}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-[#0F1117] border border-[#2A2D3A] p-3 mb-3 rounded-lg transition
                            ${snapshot.isDragging
                              ? 'opacity-80 shadow-lg border-[#6C56EB]'
                              : 'hover:border-[#6C56EB]'}`}
                        >
                          <p className="font-medium text-sm mb-1">
                            {task.title}
                          </p>

                          <p className="text-xs text-[#5A5E72]">
                            {task.assignee_name || 'Unassigned'}
                          </p>

                          {task.due_date && (
                            <p className="text-xs text-red-400">
                              Due: {task.due_date}
                            </p>
                          )}

                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-500 text-xs mt-2 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}

        </div>
      </DragDropContext>
    </div>
  );
};

export default ProjectDetailsPage;