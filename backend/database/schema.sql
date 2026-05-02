-- Team Task Manager Database Schema
-- Version: 1.0
-- Date: 2026-04-30

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id INT NOT NULL,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_owner_id (owner_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PROJECT_MEMBERS TABLE (Many-to-Many with Role)
-- ============================================
CREATE TABLE project_members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  role ENUM('admin', 'member') DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_project_member (project_id, user_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_project_id (project_id),
  INDEX idx_user_id (user_id),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TASKS TABLE
-- ============================================
CREATE TABLE tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  project_id INT NOT NULL,
  assignee_id INT,
  status ENUM('todo', 'in_progress', 'completed') DEFAULT 'todo',
  due_date DATE,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_project_id (project_id),
  INDEX idx_assignee_id (assignee_id),
  INDEX idx_status (status),
  INDEX idx_due_date (due_date),
  INDEX idx_project_status (project_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TASK_COMMENTS TABLE
-- ============================================
CREATE TABLE task_comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  task_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_task_id (task_id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INDEXES (Additional for Performance)
-- ============================================
-- Already created in table definitions
-- Additional composite indexes if needed:
-- CREATE INDEX idx_tasks_project_assignee ON tasks(project_id, assignee_id);
-- CREATE INDEX idx_project_members_composite ON project_members(project_id, user_id, role);

-- ============================================
-- SAMPLE DATA (OPTIONAL - for testing)
-- ============================================

-- Sample Users
INSERT INTO users (name, email, password_hash) VALUES 
('John Doe', 'john@example.com', '$2a$10$KIXxPfxkT0g.F0gZnwZ3H.J5R3wvHp8qX0g3V5M1Q6r0E8K4Zq6Jy'),
('Jane Smith', 'jane@example.com', '$2a$10$KIXxPfxkT0g.F0gZnwZ3H.J5R3wvHp8qX0g3V5M1Q6r0E8K4Zq6Jy'),
('Mike Johnson', 'mike@example.com', '$2a$10$KIXxPfxkT0g.F0gZnwZ3H.J5R3wvHp8qX0g3V5M1Q6r0E8K4Zq6Jy'),
('Sarah Williams', 'sarah@example.com', '$2a$10$KIXxPfxkT0g.F0gZnwZ3H.J5R3wvHp8qX0g3V5M1Q6r0E8K4Zq6Jy');

-- Sample Projects (created by John)
INSERT INTO projects (name, description, owner_id) VALUES 
('Mobile App Redesign', 'Redesign the mobile app UI/UX', 1),
('Website Optimization', 'Improve website performance and SEO', 1),
('Data Migration', 'Migrate legacy system to cloud', 1);

-- Sample Project Members
INSERT INTO project_members (project_id, user_id, role) VALUES 
(1, 1, 'admin'),     -- John is admin
(1, 2, 'member'),    -- Jane is member
(1, 3, 'member'),    -- Mike is member
(2, 1, 'admin'),     -- John is admin
(2, 2, 'admin'),     -- Jane is admin
(2, 4, 'member'),    -- Sarah is member
(3, 1, 'admin'),     -- John is admin
(3, 3, 'member'),    -- Mike is member
(3, 4, 'member');    -- Sarah is member

-- Sample Tasks
INSERT INTO tasks (title, description, project_id, assignee_id, status, due_date) VALUES 
('Design login screen', 'Create mockups for new login flow', 1, 2, 'in_progress', '2026-05-15'),
('Implement authentication', 'Set up JWT-based auth', 1, 3, 'todo', '2026-05-20'),
('Test on iOS', 'QA testing on iPhone 12+', 1, 2, 'todo', '2026-05-25'),
('Optimize database queries', 'Improve slow running queries', 2, 4, 'in_progress', '2026-05-10'),
('Set up CDN', 'Configure CloudFront for assets', 2, 1, 'todo', '2026-05-12'),
('Prepare migration plan', 'Document all systems to migrate', 3, 3, 'todo', '2026-06-01'),
('Extract data from legacy DB', 'Export all data', 3, 3, 'in_progress', '2026-06-10');

-- Sample Task Comments
INSERT INTO task_comments (task_id, user_id, content) VALUES 
(1, 1, 'Let''s focus on accessibility for this redesign'),
(1, 2, 'Added a dark mode option in the mockups'),
(2, 3, 'I''ll start with the backend implementation'),
(4, 4, 'Found N+1 query issues in user dashboard'),
(4, 1, 'Great catch! Let''s refactor those queries');

-- ============================================
-- QUERIES FOR TESTING
-- ============================================

-- Get all projects for a user
-- SELECT DISTINCT p.* FROM projects p
-- JOIN project_members pm ON p.id = pm.project_id
-- WHERE pm.user_id = 1 AND p.deleted_at IS NULL
-- ORDER BY p.created_at DESC;

-- Get project details with members
-- SELECT p.*, 
--   GROUP_CONCAT(CONCAT(u.id, ':', u.name, ':', pm.role) SEPARATOR ',') as members
-- FROM projects p
-- LEFT JOIN project_members pm ON p.id = pm.project_id
-- LEFT JOIN users u ON pm.user_id = u.id
-- WHERE p.id = 1 AND p.deleted_at IS NULL
-- GROUP BY p.id;

-- Get tasks with assignee details
-- SELECT t.*, u.name as assignee_name, u.email as assignee_email
-- FROM tasks t
-- LEFT JOIN users u ON t.assignee_id = u.id
-- WHERE t.project_id = 1 AND t.deleted_at IS NULL
-- ORDER BY t.due_date ASC;

-- Get overdue tasks
-- SELECT t.*, u.name as assignee_name
-- FROM tasks t
-- LEFT JOIN users u ON t.assignee_id = u.id
-- WHERE t.due_date < CURDATE()
-- AND t.status != 'completed'
-- AND t.deleted_at IS NULL
-- ORDER BY t.due_date ASC;

-- Get task summary by status
-- SELECT 
--   status, 
--   COUNT(*) as count
-- FROM tasks
-- WHERE project_id = 1 AND deleted_at IS NULL
-- GROUP BY status;
