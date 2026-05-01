module.exports = {
  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  },

  // Error Codes
  ERROR_CODES: {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    SERVER_ERROR: 'SERVER_ERROR',
  },

  // Roles
  ROLES: {
    ADMIN: 'admin',
    MEMBER: 'member',
  },

  // Task Status
  TASK_STATUS: {
    TODO: 'todo',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
  },

  // Pagination
  PAGINATION: {
    DEFAULT_LIMIT: 10,
    DEFAULT_PAGE: 1,
    MAX_LIMIT: 100,
  },

  // Messages
  MESSAGES: {
    // Auth
    SIGNUP_SUCCESS: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    TOKEN_REFRESHED: 'Token refreshed successfully',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_ALREADY_EXISTS: 'Email already registered',
    USER_NOT_FOUND: 'User not found',
    UNAUTHORIZED_ACCESS: 'Unauthorized access',

    // Projects
    PROJECT_CREATED: 'Project created successfully',
    PROJECT_UPDATED: 'Project updated successfully',
    PROJECT_DELETED: 'Project deleted successfully',
    PROJECT_NOT_FOUND: 'Project not found',

    // Members
    MEMBER_ADDED: 'Member added successfully',
    MEMBER_REMOVED: 'Member removed successfully',
    MEMBER_ROLE_UPDATED: 'Member role updated successfully',
    MEMBER_NOT_FOUND: 'Member not found',
    USER_ALREADY_MEMBER: 'User is already a member of this project',

    // Tasks
    TASK_CREATED: 'Task created successfully',
    TASK_UPDATED: 'Task updated successfully',
    TASK_DELETED: 'Task deleted successfully',
    TASK_STATUS_UPDATED: 'Task status updated successfully',
    TASK_NOT_FOUND: 'Task not found',

    // Comments
    COMMENT_ADDED: 'Comment added successfully',
    COMMENT_DELETED: 'Comment deleted successfully',
    COMMENT_NOT_FOUND: 'Comment not found',

    // Validation
    EMAIL_REQUIRED: 'Email is required',
    PASSWORD_REQUIRED: 'Password is required',
    NAME_REQUIRED: 'Name is required',
    INVALID_EMAIL: 'Invalid email format',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
    PASSWORD_WEAK: 'Password must contain at least 1 uppercase letter and 1 number',
    PROJECT_NAME_REQUIRED: 'Project name is required',
    TASK_TITLE_REQUIRED: 'Task title is required',
    INVALID_ROLE: 'Invalid role',
    INVALID_STATUS: 'Invalid status',

    // Permissions
    INSUFFICIENT_PERMISSIONS: 'Insufficient permissions to perform this action',
    ONLY_ADMIN_CAN_MANAGE_MEMBERS: 'Only project admin can manage members',
    ONLY_ADMIN_CAN_DELETE_PROJECT: 'Only project admin can delete project',
    NOT_PROJECT_MEMBER: 'User is not a member of this project',
  },
};
