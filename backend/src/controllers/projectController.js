const { sendSuccess, sendError, sendNotFound, sendForbidden, sendConflict } = require('../utils/response');
const logger = require('../utils/logger');
const { HTTP_STATUS, ROLES, MESSAGES } = require('../config/constants');
const projectModel = require('../models/projectModel');
const projectMemberModel = require('../models/projectMemberModel');
const userModel = require('../models/userModel');
const taskService = require('../services/taskService');

/**
 * Create Project
 */
exports.createProject = (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.user_id;

  if (!name || name.trim().length === 0) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'VALIDATION_ERROR', 'Project name is required');
  }

  const projectData = {
    name: name.trim(),
    description: description ? description.trim() : '',
    owner_id: userId
  };

  projectModel.createProject(projectData, (err, project) => {
    if (err) {
      logger.error('Error creating project', { error: err.message });
      return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
    }

    projectMemberModel.addProjectMember(
      { project_id: project.id, user_id: userId, role: ROLES.ADMIN },
      () => {
        return sendSuccess(res, project, 'Project created successfully', HTTP_STATUS.CREATED);
      }
    );
  });
};

/**
 * Get All Projects
 */
exports.getAllProjects = (req, res) => {
  const userId = req.user.user_id;

  projectModel.getProjectsByUserId(userId, (err, projects) => {
    if (err) {
      return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
    }

    return sendSuccess(res, projects || [], 'Projects retrieved successfully');
  });
};

/**
 * Get Project Details
 */
exports.getProjectDetails = (req, res) => {
  const projectId = req.params.id;
  const userId = req.user.user_id;

  projectModel.getProjectById(projectId, (err, project) => {
    if (err) return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
    if (!project) return sendNotFound(res, 'Project not found');

    projectMemberModel.getUserProjectRole(projectId, userId, (err, role) => {
      if (!role) return sendForbidden(res, 'No access');

      return sendSuccess(res, project, 'Project details retrieved successfully');
    });
  });
};

/**
 * Update Project
 */
exports.updateProject = (req, res) => {
  const projectId = req.params.id;
  const userId = req.user.user_id;

  projectMemberModel.getUserProjectRole(projectId, userId, (err, role) => {
    if (role !== ROLES.ADMIN) return sendForbidden(res, 'Only admins allowed');

    projectModel.updateProject(projectId, req.body, (err, project) => {
      if (!project) return sendNotFound(res, 'Project not found');
      return sendSuccess(res, project, 'Project updated successfully');
    });
  });
};

/**
 * Delete Project
 */
exports.deleteProject = (req, res) => {
  const projectId = req.params.id;
  const userId = req.user.user_id;

  projectMemberModel.getUserProjectRole(projectId, userId, (err, role) => {
    if (role !== ROLES.ADMIN) return sendForbidden(res, 'Only admins allowed');

    projectModel.deleteProject(projectId, () => {
      return sendSuccess(res, {}, 'Project deleted', HTTP_STATUS.NO_CONTENT);
    });
  });
};

/**
 * Members
 */
exports.addProjectMember = (req, res) => {
  const projectId = req.params.id;
  const { user_id, role } = req.body;

  projectMemberModel.addProjectMember({ project_id: projectId, user_id, role }, (err, member) => {
    return sendSuccess(res, member, 'Member added', HTTP_STATUS.CREATED);
  });
};

exports.getProjectMembers = (req, res) => {
  projectMemberModel.getProjectMembers(req.params.id, (err, members) => {
    return sendSuccess(res, members || [], 'Members fetched');
  });
};

exports.removeProjectMember = (req, res) => {
  projectMemberModel.removeProjectMember(req.params.id, req.params.userId, () => {
    return sendSuccess(res, {}, 'Member removed', HTTP_STATUS.NO_CONTENT);
  });
};

exports.updateMemberRole = (req, res) => {
  projectMemberModel.updateMemberRole(req.params.id, req.params.userId, req.body.role, (err, member) => {
    return sendSuccess(res, member, 'Role updated');
  });
};

/**
 * TASKS (FINAL CLEAN)
 */

exports.createTask = (req, res) => {
  taskService.createTask(
    { ...req.body, project_id: req.params.id },
    (err, task) => {
      if (err) return sendError(res, 500, 'DB_ERROR', 'Failed');
      return sendSuccess(res, task, 'Task created', HTTP_STATUS.CREATED);
    }
  );
};

exports.getProjectTasks = (req, res) => {
  taskService.getProjectTasks(req.params.id, req.query, (err, tasks) => {
    return sendSuccess(res, tasks || [], 'Tasks fetched');
  });
};

exports.updateTask = (req, res) => {
  taskService.updateTask(req.params.taskId, req.body, (err, task) => {
    return sendSuccess(res, task, 'Task updated');
  });
};

exports.deleteTask = (req, res) => {
  taskService.deleteTask(req.params.taskId, () => {
    return sendSuccess(res, {}, 'Task deleted', HTTP_STATUS.NO_CONTENT);
  });
};

module.exports = exports;