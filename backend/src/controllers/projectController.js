// Project Controller

const { sendSuccess, sendError, sendNotFound, sendForbidden, sendConflict } = require('../utils/response');
const logger = require('../utils/logger');
const { HTTP_STATUS, ROLES, MESSAGES } = require('../config/constants');
const projectModel = require('../models/projectModel');
const projectMemberModel = require('../models/projectMemberModel');
const userModel = require('../models/userModel');

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

    // Add creator as admin
    projectMemberModel.addProjectMember(
      { project_id: project.id, user_id: userId, role: ROLES.ADMIN },
      (err) => {
        if (err) {
          logger.error('Error adding project member', { error: err.message });
          return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
        }

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
    if (err) {
      return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
    }

    if (!project) {
      return sendNotFound(res, 'Project not found');
    }

    projectMemberModel.getUserProjectRole(projectId, userId, (err, role) => {
      if (err) {
        return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
      }

      if (!role) {
        return sendForbidden(res, 'You do not have access to this project');
      }

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
  const { name, description } = req.body;

  // 🔥 RBAC CHECK (Missing in your code)
  projectMemberModel.getUserProjectRole(projectId, userId, (err, role) => {
    if (err) {
      return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
    }

    if (role !== ROLES.ADMIN) {
      return sendForbidden(res, 'Only admins can update project');
    }

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (description) updateData.description = description.trim();

    projectModel.updateProject(projectId, updateData, (err, project) => {
      if (err) {
        return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
      }

      if (!project) {
        return sendNotFound(res, 'Project not found');
      }

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

  // 🔥 RBAC CHECK
  projectMemberModel.getUserProjectRole(projectId, userId, (err, role) => {
    if (err) {
      return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
    }

    if (role !== ROLES.ADMIN) {
      return sendForbidden(res, 'Only admins can delete project');
    }

    projectModel.deleteProject(projectId, (err) => {
      if (err) {
        return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
      }

      return sendSuccess(res, {}, 'Project deleted successfully', HTTP_STATUS.NO_CONTENT);
    });
  });
};

/**
 * Add Project Member
 */
exports.addProjectMember = (req, res) => {
  const projectId = req.params.id;
  const { user_id, role } = req.body;

  userModel.getUserById(user_id, (err, user) => {
    if (err) {
      return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
    }

    if (!user) {
      return sendNotFound(res, 'User not found');
    }

    projectMemberModel.isProjectMember(projectId, user_id, (err, isMember) => {
      if (err) {
        return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
      }

      if (isMember) {
        return sendConflict(res, 'User is already a member');
      }

      projectMemberModel.addProjectMember(
        { project_id: projectId, user_id, role },
        (err, member) => {
          if (err) {
            return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
          }

          return sendSuccess(res, member, 'Member added successfully', HTTP_STATUS.CREATED);
        }
      );
    });
  });
};

/**
 * Get Project Members
 */
exports.getProjectMembers = (req, res) => {
  const projectId = req.params.id;

  projectMemberModel.getProjectMembers(projectId, (err, members) => {
    if (err) {
      return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
    }

    return sendSuccess(res, members || [], 'Members retrieved successfully');
  });
};

/**
 * Remove Project Member
 */
exports.removeProjectMember = (req, res) => {
  const projectId = req.params.id;
  const userId = req.params.userId;

  projectMemberModel.removeProjectMember(projectId, userId, (err) => {
    if (err) {
      return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
    }

    return sendSuccess(res, {}, 'Member removed successfully', HTTP_STATUS.NO_CONTENT);
  });
};

/**
 * Update Member Role
 */
exports.updateMemberRole = (req, res) => {
  const projectId = req.params.id;
  const userId = req.params.userId;
  const { role } = req.body;

  projectMemberModel.updateMemberRole(projectId, userId, role, (err, member) => {
    if (err) {
      return sendError(res, HTTP_STATUS.SERVER_ERROR, 'DB_ERROR', MESSAGES.SERVER_ERROR);
    }

    if (!member) {
      return sendNotFound(res, 'Member not found');
    }

    return sendSuccess(res, member, 'Member role updated successfully');
  });
};

module.exports = exports;