const bcrypt = require('bcrypt');

const { sendSuccess, sendError, sendNotFound } = require('../utils/response');
const logger = require('../utils/logger');
const { ROLES } = require('../config/constants');

const projectModel = require('../models/projectModel');
const projectMemberModel = require('../models/projectMemberModel');
const userModel = require('../models/userModel');
const taskService = require('../services/taskService');
const taskModel = require('../models/taskModel');

/**
 * CREATE PROJECT
 */
exports.createProject = (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.user_id;

  if (!name || !name.trim()) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'Project name is required');
  }

  projectModel.createProject(
    { name: name.trim(), description: description || '', owner_id: userId },
    (err, project) => {
      if (err) return sendError(res, 500, 'DB_ERROR', err.message);

      projectMemberModel.addProjectMember(
        { project_id: project.id, user_id: userId, role: ROLES.ADMIN },
        () => sendSuccess(res, project, 'Project created', 201)
      );
    }
  );
};

/**
 * INVITE MEMBER
 */
exports.inviteMember = (req, res) => {
  const projectId = req.params.id;
  const { name, email } = req.body;

  if (!email) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'Email is required');
  }

  const hashedPassword = bcrypt.hashSync('123456', 10);

  userModel.getUserByEmail(email, (err, existingUser) => {
    if (err) return sendError(res, 500, 'DB_ERROR', err.message);

    if (existingUser) {
      userModel.updateUser(existingUser.id, { password_hash: hashedPassword }, () => {
        projectMemberModel.addProjectMember(
          { project_id: projectId, user_id: existingUser.id, role: ROLES.MEMBER },
          () => sendSuccess(res, {}, 'User added (password reset)')
        );
      });
    } else {
      userModel.createUser(
        { name: name || 'New User', email, password_hash: hashedPassword },
        (err3, newUser) => {
          if (err3) return sendError(res, 500, 'DB_ERROR', err3.message);

          projectMemberModel.addProjectMember(
            { project_id: projectId, user_id: newUser.id, role: ROLES.MEMBER },
            () => sendSuccess(res, {}, 'User created + added')
          );
        }
      );
    }
  });
};

/**
 * 🔥 ADD MEMBER (MISSING FIX)
 */
exports.addProjectMember = (req, res) => {
  const projectId = req.params.id;
  const { user_id, role } = req.body;

  if (!user_id) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'User ID required');
  }

  projectMemberModel.addProjectMember(
    { project_id: projectId, user_id, role: role || ROLES.MEMBER },
    (err, member) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return sendError(res, 400, 'DUPLICATE', 'User already in project');
        }
        return sendError(res, 500, 'DB_ERROR', err.message);
      }
      return sendSuccess(res, member, 'Member added', 201);
    }
  );
};

/**
 * 🔥 REMOVE MEMBER (MISSING FIX)
 */
exports.removeProjectMember = (req, res) => {
  const { id, userId } = req.params;

  projectMemberModel.removeProjectMember(id, userId, (err) => {
    if (err) return sendError(res, 500, 'DB_ERROR', err.message);
    return sendSuccess(res, {}, 'Member removed', 204);
  });
};

/**
 * GET PROJECTS
 */
exports.getAllProjects = (req, res) => {
  projectModel.getProjectsByUserId(req.user.user_id, (err, projects) => {
    if (err) return sendError(res, 500, 'DB_ERROR', err.message);
    return sendSuccess(res, projects || [], 'Projects fetched');
  });
};

/**
 * GET PROJECT DETAILS
 */
exports.getProjectDetails = (req, res) => {
  projectModel.getProjectById(req.params.id, (err, project) => {
    if (!project) return sendNotFound(res, 'Project not found');
    return sendSuccess(res, project, 'Project details');
  });
};

/**
 * GET MEMBERS
 */
exports.getProjectMembers = (req, res) => {
  projectMemberModel.getProjectMembers(req.params.id, (err, members) => {
    return sendSuccess(res, members || [], 'Members fetched');
  });
};

/**
 * CREATE TASK
 */
exports.createTask = (req, res) => {
  const { title, description, due_date, assignee_id } = req.body;
  const projectId = req.params.id;

  if (!title || !title.trim()) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'Title required');
  }

  taskModel.createTask(
    {
      title: title.trim(),
      description: description || '',
      project_id: projectId,
      assignee_id: assignee_id || req.user.user_id,
      due_date: due_date || null
    },
    (err, task) => {
      if (err) return sendError(res, 500, 'DB_ERROR', err.message);
      return sendSuccess(res, task, 'Task created', 201);
    }
  );
};

/**
 * GET TASKS
 */
exports.getProjectTasks = (req, res) => {
  taskService.getProjectTasks(req.params.id, req.query, (err, tasks) => {
    if (err) return sendError(res, 500, 'DB_ERROR', err.message);
    return sendSuccess(res, tasks || [], 'Tasks fetched');
  });
};

/**
 * UPDATE TASK
 */
exports.updateTask = (req, res) => {
  taskService.updateTask(req.params.taskId, req.body, (err, task) => {
    if (err) return sendError(res, 500, 'DB_ERROR', err.message);
    return sendSuccess(res, task, 'Task updated');
  });
};

/**
 * UPDATE STATUS
 */
exports.updateTaskStatus = (req, res) => {
  taskService.updateTaskStatus(req.params.taskId, req.body.status, (err, task) => {
    if (err) return sendError(res, 500, 'DB_ERROR', err.message);
    return sendSuccess(res, task, 'Status updated');
  });
};

/**
 * DELETE TASK
 */
exports.deleteTask = (req, res) => {
  taskService.deleteTask(req.params.taskId, () => {
    return sendSuccess(res, {}, 'Task deleted', 204);
  });
};

/**
 * UPDATE PROJECT
 */
exports.updateProject = (req, res) => {
  projectModel.updateProject(req.params.id, req.body, (err, project) => {
    if (err) return sendError(res, 500, 'DB_ERROR', err.message);
    if (!project) return sendNotFound(res, 'Project not found');
    return sendSuccess(res, project, 'Project updated');
  });
};

/**
 * DELETE PROJECT
 */
exports.deleteProject = (req, res) => {
  projectModel.deleteProject(req.params.id, () => {
    return sendSuccess(res, {}, 'Project deleted', 204);
  });
};

/**
 * UPDATE MEMBER ROLE
 */
exports.updateMemberRole = (req, res) => {
  projectMemberModel.updateMemberRole(
    req.params.id,
    req.params.userId,
    req.body.role,
    (err, member) => {
      if (err) return sendError(res, 500, 'DB_ERROR', err.message);
      return sendSuccess(res, member, 'Role updated');
    }
  );
};