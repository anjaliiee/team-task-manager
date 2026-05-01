const pool = require('../config/database');
const { sendForbidden } = require('../utils/response');
const logger = require('../utils/logger');

// RBAC Middleware - Check user role in a project
const requireProjectRole = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const user_id = req.user?.id || req.user?.user_id;
      const project_id = req.params.id || req.params.projectId || req.body.project_id;

      if (!user_id) {
        logger.warn('RBAC: No user_id in request');
        return sendForbidden(res, 'User information missing');
      }

      if (!project_id) {
        logger.warn('RBAC: No project_id in request');
        return sendForbidden(res, 'Project information missing');
      }

      // Query user's role in the project
      const sql = 'SELECT role FROM project_members WHERE project_id = ? AND user_id = ?';

      pool.query(sql, [project_id, user_id], (error, results) => {
        if (error) {
          logger.error('RBAC query error', { error: error.message });
          return sendForbidden(res, 'Permission check failed');
        }

        if (results.length === 0) {
          logger.warn('RBAC: User not a project member', { user_id, project_id });
          return sendForbidden(res, 'You are not a member of this project');
        }

        const userRole = results[0].role;

        if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
          logger.warn('RBAC: Insufficient role', { user_id, project_id, userRole, allowedRoles });
          return sendForbidden(res, 'Insufficient permissions to perform this action');
        }

        // Attach member info to request
        req.member = {
          project_id,
          user_id,
          role: userRole,
        };

        logger.debug('RBAC check passed', { user_id, project_id, role: userRole });
        next();
      });
    } catch (error) {
      logger.error('RBAC middleware error', { error: error.message });
      return sendForbidden(res, 'Permission verification failed');
    }
  };
};

// Check if user is project owner (more strict than admin)
const requireProjectOwner = (req, res, next) => {
  try {
    const user_id = req.user?.id || req.user?.user_id;
    const project_id = req.params.id || req.params.projectId;

    if (!user_id || !project_id) {
      return sendForbidden(res, 'User or project information missing');
    }

    // Query to check if user is project owner
    const sql = 'SELECT owner_id FROM projects WHERE id = ?';

    pool.query(sql, [project_id], (error, results) => {
      if (error) {
        logger.error('Owner check query error', { error: error.message });
        return sendForbidden(res, 'Permission check failed');
      }

      if (results.length === 0) {
        return sendForbidden(res, 'Project not found');
      }

      if (results[0].owner_id !== user_id) {
        logger.warn('Only owner check failed', { user_id, owner_id: results[0].owner_id });
        return sendForbidden(res, 'Only project owner can perform this action');
      }

      req.project = { owner_id: results[0].owner_id };
      logger.debug('Owner check passed', { user_id, project_id });
      next();
    });
  } catch (error) {
    logger.error('Owner check middleware error', { error: error.message });
    return sendForbidden(res, 'Permission verification failed');
  }
};

module.exports = {
  requireProjectRole,
  requireProjectOwner,
};
