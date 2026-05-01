# Team Task Manager - Design Document

**Date:** April 30, 2026  
**Version:** 1.0  
**Status:** Design Phase

---

## Table of Contents
1. [High-Level Design (HLD)](#high-level-design-hld)
2. [System Architecture](#system-architecture)
3. [Sequence Diagrams](#sequence-diagrams)
4. [Low-Level Design (LLD)](#low-level-design-lld)
5. [Data Flow Diagrams](#data-flow-diagrams)
6. [API Contract](#api-contract)

---

## High-Level Design (HLD)

### 1. System Overview

The Team Task Manager is a full-stack web application built on a **three-tier architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Frontend)                   │
│  React.js | React Router | Context API | Axios | Tailwind   │
└─────────────────────────────────────────────────────────────┘
                              ↓↑
                    (REST API via HTTPS)
                              ↓↑
┌─────────────────────────────────────────────────────────────┐
│                   SERVER LAYER (Backend)                     │
│  Node.js/Express | JWT Auth | Middleware | Controllers      │
│  Validations | RBAC | Business Logic | Database Queries      │
└─────────────────────────────────────────────────────────────┘
                              ↓↑
                    (SQL Queries | Connection Pool)
                              ↓↑
┌─────────────────────────────────────────────────────────────┐
│                   DATA LAYER (Database)                      │
│  MySQL/PostgreSQL | Schema | Indexes | Transactions          │
└─────────────────────────────────────────────────────────────┘
```

### 2. Component Breakdown

#### **Frontend Components**

```
App.js
├── Layout
│   ├── NavigationBar
│   ├── Sidebar
│   └── MainContent
├── Pages
│   ├── LoginPage
│   ├── SignupPage
│   ├── DashboardPage
│   ├── ProjectsPage
│   ├── ProjectDetailsPage
│   ├── TasksPage
│   └── SettingsPage
├── Components
│   ├── Forms (LoginForm, SignupForm, ProjectForm, TaskForm)
│   ├── Cards (ProjectCard, TaskCard, MemberCard)
│   ├── Modals (CreateProjectModal, CreateTaskModal)
│   ├── Lists (ProjectList, TaskList, MemberList)
│   └── Notifications (Toast, Alert)
├── Context
│   ├── AuthContext
│   ├── ProjectContext
│   └── TaskContext
└── API
    ├── authAPI
    ├── projectAPI
    ├── taskAPI
    └── userAPI
```

#### **Backend Components**

```
server.js
├── config
│   ├── database.js (MySQL connection)
│   ├── env.js (Environment variables)
│   └── constants.js
├── middleware
│   ├── auth.js (JWT verification)
│   ├── rbac.js (Role-based access control)
│   ├── validation.js (Input validation)
│   └── errorHandler.js
├── routes
│   ├── authRoutes.js
│   ├── projectRoutes.js
│   ├── taskRoutes.js
│   ├── userRoutes.js
│   └── dashboardRoutes.js
├── controllers
│   ├── authController.js
│   ├── projectController.js
│   ├── taskController.js
│   ├── userController.js
│   └── dashboardController.js
├── models
│   ├── userModel.js
│   ├── projectModel.js
│   ├── taskModel.js
│   └── projectMemberModel.js
├── validations
│   ├── authValidation.js
│   ├── projectValidation.js
│   └── taskValidation.js
└── utils
    ├── jwt.js (Token generation/verification)
    ├── bcrypt.js (Password hashing)
    ├── response.js (Standard response format)
    └── logger.js
```

### 3. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18+ | UI framework |
| | React Router | Client-side routing |
| | Context API | State management |
| | Axios | HTTP client |
| | Tailwind CSS | Styling |
| **Backend** | Node.js 18+ | Runtime |
| | Express.js | Web framework |
| | JWT | Authentication |
| | Bcrypt | Password hashing |
| | MySQL/PostgreSQL | Database |
| **Tools** | Postman | API testing |
| | Docker | Containerization |
| | Git | Version control |

### 4. Authentication Flow

```
User Signup/Login
        ↓
[Frontend] Collects credentials
        ↓
POST /api/auth/login (email, password)
        ↓
[Backend] Validates credentials
        ↓
Hash password + Compare with DB
        ↓
If Match: Generate JWT token
        ↓
Return token to frontend
        ↓
[Frontend] Store token (localStorage)
        ↓
Subsequent requests include JWT in Authorization header
        ↓
[Backend] Middleware verifies token
        ↓
Extract user from token payload
        ↓
Grant/Deny access based on token validity
```

### 5. RBAC (Role-Based Access Control)

```
User makes request to resource
        ↓
[Middleware] Extract JWT token
        ↓
Extract user_id from token
        ↓
Fetch project_members(user_id, project_id)
        ↓
Check role: admin or member?
        ↓
If admin: Allow all operations
If member: Allow limited operations
If not member: Deny (403)
        ↓
Proceed to controller or return error
```

**Permission Matrix:**

| Operation | Owner | Admin | Member | Non-Member |
|-----------|-------|-------|--------|------------|
| Create project | ✅ | - | - | - |
| View project | ✅ | ✅ | ✅ | ❌ |
| Edit project | ✅ | ✅ | ❌ | ❌ |
| Delete project | ✅ | ✅ | ❌ | ❌ |
| Add members | ✅ | ✅ | ❌ | ❌ |
| Remove members | ✅ | ✅ | ❌ | ❌ |
| Create task | ✅ | ✅ | ✅ | ❌ |
| Edit task | ✅ | ✅ | ✅* | ❌ |
| Assign task | ✅ | ✅ | ✅* | ❌ |
| Delete task | ✅ | ✅ | ❌ | ❌ |

*Member can only edit/assign if they're the creator or assignee

---

## System Architecture

### Request-Response Cycle

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT REQUEST                         │
│  Method: POST, Path: /api/projects, Body: {name, desc}      │
│  Headers: Authorization: Bearer <JWT_TOKEN>                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   ROUTING LAYER                              │
│  Express Router matches: POST /api/projects                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 MIDDLEWARE STACK (Sequential)                │
│  1. authMiddleware → Verify JWT, Extract user               │
│  2. validationMiddleware → Validate request body             │
│  3. rbacMiddleware → Check user role (if needed)            │
│  4. errorHandler → Catch and format errors                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   CONTROLLER LAYER                           │
│  projectController.createProject(req, res)                   │
│  - Extract data from req.body                               │
│  - Validate business logic                                  │
│  - Call model methods                                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    MODEL LAYER                               │
│  projectModel.create({name, description, owner_id})         │
│  - Execute SQL INSERT query                                 │
│  - Handle database errors                                   │
│  - Return inserted record                                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                             │
│  MySQL: INSERT INTO projects (name, description, owner_id) │
│         VALUES (?, ?, ?)                                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│            RESPONSE & ERROR HANDLING                         │
│  Success: { status: 200, data: {...}, message: "Created" }  │
│  Error:   { status: 400, error: "...", message: "..." }     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   CLIENT RECEIVES                            │
│  Response handled by Axios interceptor                       │
│  UI updated with new data                                   │
└─────────────────────────────────────────────────────────────┘
```

### Database Connection Management

```
Application Start
        ↓
Connect to MySQL
        ↓
Create Connection Pool (10-20 connections)
        ↓
Ready to accept requests
        ↓
Each request gets a connection from pool
        ↓
Query executes
        ↓
Connection returned to pool
        ↓
Application Shutdown: Close all connections
```

---

## Sequence Diagrams

### 1. User Registration Flow

```
User              Frontend         Backend         Database
 │                   │               │               │
 ├─ Fill form ─────→ │               │               │
 │                   │               │               │
 │                   ├─ POST /auth/signup (email, password, name)
 │                   │              │               │
 │                   │              ├─ Validate input
 │                   │              │
 │                   │              ├─ Check email exists
 │                   │              │              │
 │                   │              ├─ Query users table
 │                   │              │←─ Email not found
 │                   │              │
 │                   │              ├─ Hash password
 │                   │              │
 │                   │              ├─ INSERT user record
 │                   │              │              │
 │                   │              ├────────────→ INSERT
 │                   │              │              │
 │                   │              │←─────────── User ID
 │                   │              │
 │                   │              ├─ Generate JWT token
 │                   │              │
 │                   │←─ 201 Created + JWT + user data
 │                   │
 │←─ Store JWT + redirect to dashboard
```

### 2. User Login Flow

```
User              Frontend         Backend         Database
 │                   │               │               │
 ├─ Enter credentials
 ├─────────────────→ │               │               │
 │                   │               │               │
 │                   ├─ POST /auth/login (email, password)
 │                   │              │               │
 │                   │              ├─ Validate input
 │                   │              │
 │                   │              ├─ Query user by email
 │                   │              │              │
 │                   │              ├────────────→ SELECT
 │                   │              │              │
 │                   │              │←─────────── User record
 │                   │              │
 │                   │              ├─ Compare passwords
 │                   │              │  (bcrypt.compare)
 │                   │              │
 │                   │              ├─ Passwords match?
 │                   │              │  Yes:
 │                   │              │  ├─ Generate JWT
 │                   │              │  └─ Return token
 │                   │              │  No:
 │                   │              │  └─ Return 401 error
 │                   │              │
 │                   │←─ 200 OK + JWT + user data
 │                   │
 │←─ Store JWT + redirect
```

### 3. Create Project with Members Flow

```
User              Frontend         Backend         Database
 │                   │               │               │
 ├─ Create project form
 ├─────────────────→ │               │               │
 │                   │               │               │
 │                   ├─ POST /api/projects (JWT, name, desc)
 │                   │              │               │
 │                   │              ├─ authMiddleware
 │                   │              │  ├─ Verify JWT
 │                   │              │  └─ Extract user_id
 │                   │              │
 │                   │              ├─ validationMiddleware
 │                   │              │  └─ Validate inputs
 │                   │              │
 │                   │              ├─ projectController.create()
 │                   │              │  ├─ Check business logic
 │                   │              │  └─ Call model
 │                   │              │
 │                   │              ├─ INSERT project
 │                   │              │              │
 │                   │              ├────────────→ INSERT
 │                   │              │              │
 │                   │              │←─────────── Project ID
 │                   │              │
 │                   │              ├─ INSERT project_member (owner)
 │                   │              │              │
 │                   │              ├────────────→ INSERT
 │                   │              │  role='admin'
 │                   │              │              │
 │                   │              │←─────────── Success
 │                   │              │
 │                   │←─ 201 Created + project data
 │                   │
 │←─ Show success + redirect to project
```

### 4. Add Team Member to Project Flow

```
Admin User        Frontend         Backend         Database
 │                   │               │               │
 ├─ Open members modal
 ├─────────────────→ │               │               │
 │                   │               │               │
 │                   ├─ POST /api/projects/:id/members (JWT, user_id, role)
 │                   │              │               │
 │                   │              ├─ authMiddleware
 │                   │              │
 │                   │              ├─ rbacMiddleware
 │                   │              │  ├─ Check user is admin
 │                   │              │  │              │
 │                   │              │  ├──────────→ Query
 │                   │              │  │  project_members
 │                   │              │  │              │
 │                   │              │  │←────────── Role
 │                   │              │  └─ role == 'admin'?
 │                   │              │
 │                   │              ├─ Validate user_id exists
 │                   │              │              │
 │                   │              ├──────────────→ SELECT
 │                   │              │              │
 │                   │              │←────────── User found
 │                   │              │
 │                   │              ├─ Check not already member
 │                   │              │              │
 │                   │              ├──────────────→ SELECT
 │                   │              │  project_members
 │                   │              │              │
 │                   │              │←────────── Not found
 │                   │              │
 │                   │              ├─ INSERT project_member
 │                   │              │              │
 │                   │              ├──────────────→ INSERT
 │                   │              │              │
 │                   │              │←────────── Success
 │                   │              │
 │                   │←─ 201 Created + member data
 │                   │
 │←─ Update members list
```

### 5. Create Task and Assign Flow

```
Project Member    Frontend         Backend         Database
 │                   │               │               │
 ├─ Create task form
 ├─────────────────→ │               │               │
 │                   │               │               │
 │                   ├─ POST /api/projects/:id/tasks (JWT, title, assignee_id)
 │                   │              │               │
 │                   │              ├─ authMiddleware
 │                   │              │
 │                   │              ├─ rbacMiddleware
 │                   │              │  └─ Check user is member
 │                   │              │
 │                   │              ├─ Validate assignee is member
 │                   │              │              │
 │                   │              ├──────────────→ Query
 │                   │              │  project_members
 │                   │              │              │
 │                   │              │←────────── Found
 │                   │              │
 │                   │              ├─ INSERT task
 │                   │              │              │
 │                   │              ├──────────────→ INSERT
 │                   │              │              │
 │                   │              │←────────── Task ID
 │                   │              │
 │                   │←─ 201 Created + task data
 │                   │
 │←─ Show task created
```

### 6. Update Task Status Flow

```
Task Assignee     Frontend         Backend         Database
 │                   │               │               │
 ├─ Click status dropdown
 ├─────────────────→ │               │               │
 │                   │               │               │
 │                   ├─ PATCH /api/projects/:id/tasks/:taskId/status (JWT, status)
 │                   │              │               │
 │                   │              ├─ authMiddleware
 │                   │              │
 │                   │              ├─ rbacMiddleware
 │                   │              │  └─ Check user is assignee/admin
 │                   │              │              │
 │                   │              │              ├→ Query tasks
 │                   │              │              │
 │                   │              │              ←─ Get assignee_id
 │                   │              │
 │                   │              ├─ UPDATE task status
 │                   │              │              │
 │                   │              ├──────────────→ UPDATE
 │                   │              │              │
 │                   │              │←────────── Rows affected
 │                   │              │
 │                   │←─ 200 OK + updated task
 │                   │
 │←─ Update UI with new status
```

### 7. Dashboard Fetch Flow

```
User              Frontend         Backend         Database
 │                   │               │               │
 ├─ Navigate to dashboard
 ├─────────────────→ │               │               │
 │                   │               │               │
 │                   ├─ GET /api/dashboard/summary (JWT)
 │                   │              │               │
 │                   │              ├─ authMiddleware
 │                   │              │
 │                   │              ├─ dashboardController.getSummary()
 │                   │              │
 │                   │              ├─ Query 1: Count projects
 │                   │              │              │
 │                   │              ├──────────────→ SELECT COUNT
 │                   │              │  (projects)
 │                   │              │              │
 │                   │              │←────────── Count
 │                   │              │
 │                   │              ├─ Query 2: Count assigned tasks
 │                   │              │              │
 │                   │              ├──────────────→ SELECT COUNT
 │                   │              │  (tasks)
 │                   │              │              │
 │                   │              │←────────── Count
 │                   │              │
 │                   │              ├─ Query 3: Overdue tasks
 │                   │              │              │
 │                   │              ├──────────────→ SELECT * WHERE
 │                   │              │  due_date < TODAY
 │                   │              │              │
 │                   │              │←────────── List
 │                   │              │
 │                   │              ├─ Aggregate results
 │                   │              │
 │                   │←─ 200 OK + {projects: X, tasks: Y, overdue: Z}
 │                   │
 │←─ Render dashboard widgets
```

---

## Low-Level Design (LLD)

### 1. Authentication Module

#### JWT Strategy

```javascript
// Token Structure
{
  header: {
    alg: "HS256",
    typ: "JWT"
  },
  payload: {
    user_id: 1,
    email: "user@example.com",
    name: "John Doe",
    iat: 1640000000,        // issued at
    exp: 1640003600,        // expires in 1 hour
    iss: "Team Task Manager"
  },
  signature: "HMAC_SHA256(...)"
}

// Token Lifecycle:
// 1. Login: Generate JWT with 1-hour expiry
// 2. Request: Send in Authorization: Bearer <token>
// 3. Verify: Check signature and expiry
// 4. Refresh: Generate new token before expiry
// 5. Logout: Delete token from client
```

#### Password Security

```javascript
// Signup
const plainPassword = "User@12345"
  ↓
const salt = bcrypt.genSaltSync(10)  // 10 rounds
  ↓
const hash = bcrypt.hashSync(plainPassword, salt)
  ↓
// Store hash in database

// Login
const storedHash = getFromDatabase()
const passwordMatch = bcrypt.compare(inputPassword, storedHash)
  // Returns: true or false
```

#### Auth Middleware Implementation

```javascript
authMiddleware(req, res, next):
  1. Get token from Authorization header
  2. If missing → return 401
  3. Verify token signature with secret key
  4. If invalid → return 401
  5. If expired → return 401
  6. Extract payload (user_id, email, etc.)
  7. Attach user to req.user
  8. Call next()
```

### 2. RBAC Module

#### Role-Based Middleware

```javascript
rbacMiddleware(['admin', 'member'])(req, res, next):
  1. Get user_id from req.user (set by auth middleware)
  2. Get project_id from req.params or req.body
  3. Query: SELECT role FROM project_members 
             WHERE user_id = ? AND project_id = ?
  4. If no record → return 403 (not a member)
  5. If role not in allowed list → return 403
  6. Attach member info to req.member
  7. Call next()

// Usage in routes:
// POST /api/projects/:id/members
//   - requireRole(['admin'])
//   - addMember()
```

#### Permission Checks in Controller

```javascript
// Example: Edit task
editTask(req, res):
  1. Get task from database
  2. Get current user from req.user
  3. Check permission:
     - Is user the creator? → Allow
     - Is user the assignee? → Allow limited fields
     - Is user project admin? → Allow all
     - Otherwise → Deny
  4. Update task
  5. Return 200 + updated data or 403 + error
```

### 3. Validation Module

#### Input Validation

```javascript
// Validations
signupValidation:
  - email: required, valid format, unique
  - password: required, min 8 chars, 1 uppercase, 1 number
  - name: required, max 255 chars
  
projectValidation:
  - name: required, max 255 chars
  - description: optional, max 5000 chars
  
taskValidation:
  - title: required, max 255 chars
  - description: optional, max 5000 chars
  - due_date: optional, must be >= today
  - assignee_id: optional, must be project member
  - status: optional, must be in [todo, in_progress, completed]

// Implementation
validateSignup(req, res, next):
  1. Validate email format (regex)
  2. Validate password strength
  3. Validate name length
  4. If any fail → return 400 + error message
  5. Call next()
```

### 4. Database Module

#### Connection Management

```javascript
// Connection Pool (MySQL/PostgreSQL)
pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,        // Max 10 connections
  queueLimit: 0               // Unlimited queue
})

// Usage
pool.query(sql, values, (error, results) => {
  if (error) throw error;
  return results;
});

// Connection Release: Automatic after query
```

#### Query Patterns

```javascript
// INSERT
const sql = "INSERT INTO projects (name, description, owner_id) VALUES (?, ?, ?)";
pool.query(sql, [name, description, user_id], (err, result) => {
  const projectId = result.insertId;
});

// SELECT
const sql = "SELECT * FROM projects WHERE owner_id = ? AND status != ?";
pool.query(sql, [user_id, 'deleted'], (err, rows) => {
  const projects = rows;
});

// UPDATE
const sql = "UPDATE tasks SET status = ?, updated_at = NOW() WHERE id = ?";
pool.query(sql, [status, task_id], (err, result) => {
  const affectedRows = result.affectedRows;
});

// DELETE (Soft)
const sql = "UPDATE projects SET deleted_at = NOW() WHERE id = ?";
pool.query(sql, [project_id], (err) => { });
```

### 5. Controller Module

#### Create Project Controller

```javascript
projectController.createProject(req, res):
  INPUT:
    - req.user.id (from auth middleware)
    - req.body.name
    - req.body.description
  
  STEPS:
    1. Validate inputs (via middleware)
    2. user_id = req.user.id
    3. Execute: INSERT INTO projects (name, description, owner_id)
       VALUES (name, description, user_id)
       → Returns project_id
    4. Execute: INSERT INTO project_members 
                (project_id, user_id, role)
                VALUES (project_id, user_id, 'admin')
    5. Fetch created project from DB
    6. Return: 201 + { data: project, message: "Created" }
  
  ERROR HANDLING:
    - Validation error → 400
    - DB constraint violation → 409
    - Server error → 500
```

#### Get Project Details Controller

```javascript
projectController.getProjectDetails(req, res):
  INPUT:
    - req.user.id (from auth middleware)
    - req.params.id (project_id)
  
  MIDDLEWARE CHECK:
    - rbacMiddleware (['admin', 'member'])
    - Ensures user is member
  
  STEPS:
    1. project_id = req.params.id
    2. Execute: SELECT * FROM projects WHERE id = ?
       → Returns project data
    3. Execute: SELECT u.id, u.name, pm.role FROM users u
                JOIN project_members pm ON u.id = pm.user_id
                WHERE pm.project_id = ?
       → Returns members list
    4. Execute: SELECT COUNT(*) as count FROM tasks
                WHERE project_id = ? GROUP BY status
       → Returns task summary
    5. Aggregate results
    6. Return: 200 + { data: { project, members, taskSummary } }
  
  ERROR HANDLING:
    - 404: Project not found
    - 403: User not a member (caught by RBAC middleware)
```

#### Create Task Controller

```javascript
projectController.createTask(req, res):
  INPUT:
    - req.user.id
    - req.params.id (project_id)
    - req.body.title
    - req.body.description
    - req.body.due_date
    - req.body.assignee_id (optional)
  
  MIDDLEWARE CHECKS:
    - authMiddleware (verify JWT)
    - rbacMiddleware (['admin', 'member'])
  
  STEPS:
    1. If assignee_id provided:
       - Check: SELECT * FROM project_members 
                WHERE project_id = ? AND user_id = ?
       - If not found → return 400 "Assignee not member"
    
    2. INSERT INTO tasks (title, description, project_id,
                         assignee_id, status, due_date)
       VALUES (...)
       → Returns task_id
    
    3. Fetch created task
    4. Return: 201 + { data: task }
  
  ERROR HANDLING:
    - Validation error → 400
    - Assignee not member → 400
    - DB error → 500
```

#### Update Task Status Controller

```javascript
projectController.updateTaskStatus(req, res):
  INPUT:
    - req.user.id
    - req.params.id (project_id)
    - req.params.taskId
    - req.body.status
  
  MIDDLEWARE CHECKS:
    - authMiddleware
    - Custom RBAC: Check user is assignee OR admin
  
  STEPS:
    1. SELECT * FROM tasks WHERE id = ? AND project_id = ?
       → Returns task data
    
    2. If task not found → return 404
    
    3. Check permission:
       - If user_id == task.assignee_id → Allow
       - Else: Check if user is project admin
         - SELECT role FROM project_members
           WHERE project_id = ? AND user_id = ?
         - If role != 'admin' → return 403
    
    4. UPDATE tasks SET status = ?, updated_at = NOW()
       WHERE id = ?
    
    5. Fetch updated task
    6. Return: 200 + { data: task }
  
  VALIDATION:
    - Status must be in ['todo', 'in_progress', 'completed']
```

### 6. Model Module (Database Queries)

#### Project Model

```javascript
// Create
projectModel.create({ name, description, owner_id }):
  SQL: INSERT INTO projects (name, description, owner_id)
       VALUES (?, ?, ?)
  Returns: { id, name, description, owner_id, created_at }

// Get by ID
projectModel.getById(id):
  SQL: SELECT * FROM projects WHERE id = ? AND deleted_at IS NULL
  Returns: { id, name, description, owner_id, ... }

// Get all for user
projectModel.getAllForUser(user_id):
  SQL: SELECT DISTINCT p.* FROM projects p
       JOIN project_members pm ON p.id = pm.project_id
       WHERE pm.user_id = ? AND p.deleted_at IS NULL
  Returns: [{ id, name, ... }, ...]

// Update
projectModel.update(id, { name, description }):
  SQL: UPDATE projects SET name = ?, description = ?, 
       updated_at = NOW() WHERE id = ?
  Returns: affected rows count

// Soft delete
projectModel.delete(id):
  SQL: UPDATE projects SET deleted_at = NOW() WHERE id = ?
  Returns: affected rows count
```

#### Task Model

```javascript
// Create
taskModel.create({ title, project_id, assignee_id, due_date }):
  SQL: INSERT INTO tasks (title, project_id, assignee_id, due_date, status)
       VALUES (?, ?, ?, ?, 'todo')
  Returns: { id, title, project_id, status, created_at, ... }

// Get project tasks with filtering
taskModel.getByProject(project_id, filters = {}):
  SQL: SELECT * FROM tasks WHERE project_id = ? 
       [AND status = ? if filters.status]
       [AND due_date BETWEEN ? AND ? if filters.dateRange]
       ORDER BY due_date ASC
  Returns: [{ id, title, status, ... }, ...]

// Get overdue tasks
taskModel.getOverdue(user_id):
  SQL: SELECT t.* FROM tasks t
       JOIN project_members pm ON pm.project_id = t.project_id
       WHERE (t.assignee_id = ? OR pm.role = 'admin')
       AND t.due_date < CURDATE()
       AND t.status != 'completed'
       ORDER BY t.due_date ASC
  Returns: [{ id, title, due_date, ... }, ...]

// Update status
taskModel.updateStatus(id, status):
  SQL: UPDATE tasks SET status = ?, updated_at = NOW() WHERE id = ?
  Returns: affected rows count
```

### 7. Error Handling Strategy

```javascript
// Error Response Format
{
  status: 400 | 401 | 403 | 404 | 409 | 500,
  error: "VALIDATION_ERROR" | "UNAUTHORIZED" | "FORBIDDEN" | ...,
  message: "Human-readable error message",
  details: {}  // Optional: field-level errors
}

// Error Types & HTTP Status:
ValidationError         → 400
UnauthorizedError       → 401 (Invalid JWT)
ForbiddenError          → 403 (No permission)
NotFoundError           → 404 (Resource not found)
ConflictError           → 409 (Duplicate/Constraint)
ServerError             → 500 (Internal error)

// Example Error Flow:
try {
  const user = await getUserById(id);
  if (!user) throw new NotFoundError("User not found");
} catch (error) {
  if (error instanceof NotFoundError) {
    res.status(404).json({ error: "NOT_FOUND", message: error.message });
  } else {
    res.status(500).json({ error: "SERVER_ERROR", message: "..." });
  }
}
```

---

## Data Flow Diagrams

### DFD Level 0 (Context Diagram)

```
                           ┌──────────────────┐
                           │     Users        │
                           │  (Frontend App)  │
                           └────────┬─────────┘
                                    │
                          ┌─────────┴──────────┐
                          │                    │
                    ┌─────▼────────┐    ┌──────▼──────┐
                    │   REST API   │    │  HTTP/HTTPS │
                    │   Requests   │    │  Responses  │
                    └─────┬────────┘    └──────┬──────┘
                          │                    │
                          └─────────┬──────────┘
                                    │
                           ┌────────▼─────────┐
                           │  Backend Server  │
                           │ (Node.js/Express)│
                           └────────┬─────────┘
                                    │
                          ┌─────────┴──────────┐
                          │                    │
                    ┌─────▼────────┐    ┌──────▼──────┐
                    │   Database   │    │   Storage   │
                    │  (MySQL)     │    │   Layer     │
                    └──────────────┘    └─────────────┘
```

### DFD Level 1 (Detailed)

```
              Users
                │
                ▼
        ┌───────────────┐
        │  Validation   │  ← Email format, password strength
        │  Module       │    Password match
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │ Authentication│  ← JWT generation
        │ Module        │    Token verification
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │ Authorization │  ← Role check
        │ (RBAC)        │    Permission verification
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │ Controller    │  ← Business logic
        │ Layer         │    Request handling
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │ Model Layer   │  ← Database queries
        │ (Queries)     │    Data retrieval
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │   Database    │  ← Insert/Update/Select
        │   Tables      │    Transaction handling
        └───────────────┘
```

### Data Flow: Create Project

```
Frontend                Backend                Database
   │                       │                      │
   ├─ User fills form      │                      │
   ├─ Click Create ────────→ POST /projects      │
   │                       │                      │
   │                   ┌───┴────────────┐        │
   │                   │ Auth Middleware│        │
   │                   │ (Verify JWT)   │        │
   │                   └───┬────────────┘        │
   │                       │                      │
   │                   ┌───┴──────────────────┐  │
   │                   │ Validate inputs      │  │
   │                   └───┬──────────────────┘  │
   │                       │                      │
   │                   ┌───┴──────────────────┐  │
   │                   │ Create Project       │  │
   │                   │ 1. INSERT project    ├──→ INSERT
   │                   │ 2. INSERT member     │  │  (project)
   │                   │    (owner as admin)  │  │
   │                   └───┬──────────────────┘  │
   │                       │                  ┌──┴─ INSERT
   │                       │                  │   (project_member)
   │                       │  ┌───────────────┴──┐
   │                       │  │ Return project   │
   │                       │  │ with member info │
   │                       │  └──────┬────────────┘
   │←─ 201 Created ────────┤         │
   │   + project data      │         │
   │                       │         │
   ├─ Show success         │         │
   ├─ Redirect             │         │
```

---

## API Contract

### Base Configuration

```
Base URL: http://localhost:5000/api (development)
         https://api.taskmanager.com (production)

Headers (All Requests):
  Content-Type: application/json
  Authorization: Bearer <JWT_TOKEN> (except login/signup)

Response Format:
{
  "status": 200,
  "data": { ... },
  "message": "Success message"
}

Error Format:
{
  "status": 400,
  "error": "ERROR_CODE",
  "message": "Error description",
  "details": { ... }  // Optional
}
```

### Authentication Endpoints

#### POST /auth/signup
```
Request:
  Body: {
    name: string (required, 3-255 chars),
    email: string (required, valid email),
    password: string (required, min 8 chars, 1 uppercase, 1 number)
  }

Response 201:
  {
    "status": 201,
    "data": {
      "user_id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "token": "eyJhbGc..."
    },
    "message": "User created successfully"
  }

Errors:
  400: Invalid email format
  400: Password too weak
  409: Email already exists
```

#### POST /auth/login
```
Request:
  Body: {
    email: string (required),
    password: string (required)
  }

Response 200:
  {
    "status": 200,
    "data": {
      "user_id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "token": "eyJhbGc..."
    },
    "message": "Login successful"
  }

Errors:
  400: Email or password missing
  401: Invalid credentials
  404: User not found
```

### Project Endpoints

#### POST /projects
```
Request:
  Headers: Authorization: Bearer <token>
  Body: {
    name: string (required, max 255),
    description: string (optional, max 5000)
  }

Response 201:
  {
    "status": 201,
    "data": {
      "id": 1,
      "name": "Project Name",
      "description": "...",
      "owner_id": 1,
      "created_at": "2026-04-30T10:00:00Z"
    }
  }

Errors:
  400: Validation error
  401: Unauthorized
  500: Server error
```

#### GET /projects
```
Request:
  Headers: Authorization: Bearer <token>
  Query: ?page=1&limit=10&sort=created_at&order=desc

Response 200:
  {
    "status": 200,
    "data": {
      "projects": [
        {
          "id": 1,
          "name": "Project 1",
          "description": "...",
          "owner_id": 1,
          "members_count": 5,
          "tasks_count": 12,
          "created_at": "..."
        }
      ],
      "pagination": {
        "total": 25,
        "page": 1,
        "limit": 10,
        "pages": 3
      }
    }
  }

Errors:
  401: Unauthorized
```

#### GET /projects/:id
```
Request:
  Headers: Authorization: Bearer <token>

Response 200:
  {
    "status": 200,
    "data": {
      "project": {
        "id": 1,
        "name": "Project",
        "description": "...",
        "owner_id": 1,
        "created_at": "..."
      },
      "members": [
        {
          "user_id": 1,
          "name": "John Doe",
          "email": "john@example.com",
          "role": "admin"
        }
      ],
      "task_summary": {
        "total": 12,
        "todo": 5,
        "in_progress": 3,
        "completed": 4
      }
    }
  }

Errors:
  403: User not a project member
  404: Project not found
```

#### POST /projects/:id/members
```
Request:
  Headers: Authorization: Bearer <token>
  Body: {
    user_id: integer (required),
    role: string (required, "admin" or "member")
  }

Response 201:
  {
    "status": 201,
    "data": {
      "user_id": 2,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "member",
      "joined_at": "2026-04-30T10:00:00Z"
    }
  }

Errors:
  400: User not found / Already member
  403: Insufficient permissions (not admin)
  404: Project not found
```

### Task Endpoints

#### POST /projects/:id/tasks
```
Request:
  Headers: Authorization: Bearer <token>
  Body: {
    title: string (required, max 255),
    description: string (optional, max 5000),
    assignee_id: integer (optional),
    due_date: date (optional, >= today)
  }

Response 201:
  {
    "status": 201,
    "data": {
      "id": 1,
      "title": "Task Title",
      "description": "...",
      "project_id": 1,
      "assignee_id": 2,
      "status": "todo",
      "due_date": "2026-05-15",
      "created_at": "..."
    }
  }

Errors:
  400: Validation error / Assignee not member
  401: Unauthorized
  403: Insufficient permissions
```

#### GET /projects/:id/tasks
```
Request:
  Headers: Authorization: Bearer <token>
  Query: ?status=todo&assignee_id=2&page=1&limit=20

Response 200:
  {
    "status": 200,
    "data": {
      "tasks": [
        {
          "id": 1,
          "title": "Task",
          "status": "todo",
          "assignee_id": 2,
          "due_date": "2026-05-15",
          "created_at": "..."
        }
      ],
      "pagination": { ... }
    }
  }
```

#### PATCH /projects/:id/tasks/:taskId/status
```
Request:
  Headers: Authorization: Bearer <token>
  Body: {
    status: string (required, "todo" | "in_progress" | "completed")
  }

Response 200:
  {
    "status": 200,
    "data": {
      "id": 1,
      "title": "Task",
      "status": "in_progress",
      "updated_at": "2026-04-30T10:15:00Z"
    }
  }

Errors:
  400: Invalid status
  403: User not assignee/admin
  404: Task not found
```

---

## Database Indexes

```sql
-- For faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);
CREATE INDEX idx_project_members_project_id ON project_members(project_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);

-- Composite indexes for common queries
CREATE INDEX idx_project_members_composite ON project_members(project_id, user_id);
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);
```

---

## Security Considerations

1. **Authentication:** JWT tokens with HS256 algorithm, 1-hour expiry
2. **Password:** bcrypt hashing with 10 salt rounds
3. **HTTPS:** Enforce SSL/TLS in production
4. **CORS:** Whitelist frontend domain only
5. **Input Validation:** Sanitize and validate all inputs
6. **SQL Injection:** Use parameterized queries (?)
7. **XSS Prevention:** Sanitize outputs, use React's built-in escaping
8. **RBAC:** Check permissions on every sensitive operation
9. **Rate Limiting:** Implement on auth endpoints
10. **Logging:** Log authentication and authorization failures

---

## Performance Considerations

1. **Database Queries:**
   - Use indexes on frequently queried columns
   - Aggregate queries with GROUP BY for dashboard
   - Implement pagination for large lists

2. **Caching:**
   - Cache user roles in JWT payload
   - Redis for frequently accessed data (optional)

3. **API Optimization:**
   - Return only required fields
   - Lazy load related data
   - Implement filtering/sorting on database level

4. **Frontend Optimization:**
   - Code splitting and lazy loading
   - Memoization for expensive computations
   - Virtualization for large lists

---

## Testing Strategy

1. **Unit Tests:** 80%+ coverage for auth, models, validations
2. **Integration Tests:** API endpoints with realistic scenarios
3. **E2E Tests:** Full user workflows (signup → create project → tasks)
4. **Security Tests:** JWT validation, RBAC enforcement, input validation
5. **Performance Tests:** Load testing with concurrent users

---

