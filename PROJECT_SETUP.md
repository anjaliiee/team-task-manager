# Project Setup Guide

## 📦 Project Structure

The Team Task Manager project is now fully initialized with both backend and frontend. Here's what has been created:

```
Team Task Manager/
├── backend/                          # Node.js/Express API
│   ├── src/
│   │   ├── config/                   # Configuration files
│   │   │   ├── database.js          # MySQL connection pool
│   │   │   ├── env.js               # Environment variables
│   │   │   └── constants.js         # App constants
│   │   │
│   │   ├── middleware/              # Express middleware
│   │   │   ├── auth.js              # JWT authentication
│   │   │   ├── rbac.js              # Role-based access control
│   │   │   ├── validation.js        # Input validation
│   │   │   └── errorHandler.js      # Error handling
│   │   │
│   │   ├── routes/                  # API routes
│   │   │   ├── authRoutes.js        # Auth endpoints
│   │   │   ├── projectRoutes.js     # Project endpoints
│   │   │   ├── taskRoutes.js        # Task endpoints
│   │   │   ├── userRoutes.js        # User endpoints
│   │   │   └── dashboardRoutes.js   # Dashboard endpoints
│   │   │
│   │   ├── controllers/             # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   ├── taskController.js
│   │   │   ├── userController.js
│   │   │   └── dashboardController.js
│   │   │
│   │   ├── models/                  # Database queries
│   │   │   ├── userModel.js
│   │   │   ├── projectModel.js
│   │   │   ├── projectMemberModel.js
│   │   │   └── taskModel.js
│   │   │
│   │   ├── validations/             # Joi validation schemas
│   │   │   ├── authValidation.js
│   │   │   ├── projectValidation.js
│   │   │   └── taskValidation.js
│   │   │
│   │   ├── utils/                   # Utility functions
│   │   │   ├── jwt.js               # JWT token management
│   │   │   ├── bcrypt.js            # Password hashing
│   │   │   ├── response.js          # Response formatting
│   │   │   └── logger.js            # Logging utility
│   │   │
│   │   └── server.js                # Express app entry point
│   │
│   ├── database/
│   │   └── schema.sql               # Database schema
│   │
│   ├── package.json
│   ├── .env.example
│   ├── .gitignore
│   └── README.md
│
├── frontend/                         # React app
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── pages/                   # Page components
│   │   ├── api/                     # API integration
│   │   ├── context/                 # React Context
│   │   ├── hooks/                   # Custom hooks
│   │   ├── styles/                  # CSS files
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── config.js
│   │
│   ├── public/
│   │   └── index.html
│   │
│   ├── package.json
│   ├── .env.example
│   ├── .gitignore
│   └── README.md
│
├── ROADMAP.md                       # Project roadmap
├── DESIGN.md                        # System design document
└── PROJECT_SETUP.md                 # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MySQL** >= 5.7 or **PostgreSQL** >= 12
- **Git**

### Step 1: Clone / Initialize Project

```bash
cd "c:\Users\ASUS\Documents\Team Task Manager"
```

### Step 2: Backend Setup

#### 2.1 Install Backend Dependencies

```bash
cd backend
npm install
```

#### 2.2 Create Environment File

```bash
cp .env.example .env
```

Edit `.env` and update database credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=team_task_manager
JWT_SECRET=your_very_secure_jwt_secret_key_min_32_chars
PORT=5000
```

#### 2.3 Set Up Database

**Using MySQL:**

```bash
# Create database and tables
mysql -u root -p < database/schema.sql

# Or manually run in MySQL Workbench/CLI
# Open database/schema.sql and execute
```

**Using PostgreSQL:**

Update `database/schema.sql` syntax for PostgreSQL and run:

```bash
psql -U postgres -d template1 -f database/schema.sql
```

#### 2.4 Start Backend Development Server

```bash
npm run dev
```

Backend will start at `http://localhost:5000`

Test health endpoint: `http://localhost:5000/api/health`

### Step 3: Frontend Setup

#### 3.1 Install Frontend Dependencies

```bash
cd frontend
npm install
```

#### 3.2 Create Environment File

```bash
cp .env.example .env
```

Verify `.env` has correct API URL:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Team Task Manager
```

#### 3.3 Start Frontend Development Server

```bash
npm start
```

Frontend will open at `http://localhost:3000`

---

## ✅ Verification

### Backend Verification

```bash
# In backend folder
npm run dev

# In another terminal, test the health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {
#   "status": 200,
#   "message": "Server is running",
#   "timestamp": "2026-04-30T...",
#   "environment": "development"
# }
```

### Frontend Verification

```bash
# In frontend folder
npm start

# Should open browser at http://localhost:3000
# You should see "Team Task Manager" welcome message
```

### Database Verification

```bash
# Connect to MySQL
mysql -u root -p

# Use the database
USE team_task_manager;

# Check tables
SHOW TABLES;

# Should show:
# - users
# - projects
# - project_members
# - tasks
# - task_comments
```

---

## 📝 Current Status

### ✅ Phase 0: Foundation & Architecture (COMPLETED)

- [x] Database schema created with all tables and relationships
- [x] Backend project structure initialized
- [x] Frontend project structure initialized
- [x] Configuration files created (JWT, Bcrypt, Constants)
- [x] Middleware infrastructure set up (Auth, RBAC, Validation, Error Handler)
- [x] Utility functions created (JWT, Bcrypt, Response, Logger)
- [x] Validation schemas defined (Auth, Project, Task)
- [x] Models created with database queries
- [x] Route templates created (Auth, Project, Task, Dashboard, User)
- [x] Controller templates created (all endpoints stubbed)
- [x] Frontend scaffolding completed

### ⏳ Phase 1: Authentication & User Management (NOT STARTED)

- [ ] Implement signup endpoint
- [ ] Implement login endpoint
- [ ] Implement token refresh endpoint
- [ ] Implement logout functionality
- [ ] Implement user profile endpoints
- [ ] Create frontend login page
- [ ] Create frontend signup page
- [ ] Create auth context for state management
- [ ] Implement protected routes
- [ ] Add authentication tests

### ⏳ Phase 2: Project Management & RBAC (NOT STARTED)

- [ ] Implement project CRUD endpoints
- [ ] Implement project member management
- [ ] Test RBAC middleware
- [ ] Create frontend projects page
- [ ] Create project creation modal
- [ ] Create member management UI

### ⏳ Phase 3: Task Management (NOT STARTED)

- [ ] Implement task CRUD endpoints
- [ ] Implement task assignment
- [ ] Implement task status updates
- [ ] Implement task comments
- [ ] Create frontend task list
- [ ] Create task creation/edit modals
- [ ] Create task detail view

### ⏳ Phase 4: Dashboard & Analytics (NOT STARTED)

- [ ] Implement dashboard endpoints
- [ ] Implement statistics queries
- [ ] Create frontend dashboard
- [ ] Add charts and visualizations

### ⏳ Phase 5: Frontend Polish & UX (NOT STARTED)

- [ ] Responsive design
- [ ] Dark/Light theme
- [ ] Notifications system
- [ ] Search functionality

### ⏳ Phase 6: Testing & Deployment (NOT STARTED)

- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Deployment setup

---

## 🔧 Development Workflow

### Backend Development

1. **Create model** → Define database queries in `/src/models`
2. **Create controller** → Implement logic in `/src/controllers`
3. **Add validation** → Define schema in `/src/validations`
4. **Create route** → Wire up route in `/src/routes`
5. **Test API** → Use Postman or curl

### Frontend Development

1. **Create components** → React components in `/src/components`
2. **Create pages** → Page components in `/src/pages`
3. **Create API client** → API functions in `/src/api`
4. **Integrate** → Connect components to API
5. **Test UI** → Manual testing in browser

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes
git add .
git commit -m "feat: Add feature"

# Push and create PR
git push origin feature/feature-name
```

---

## 🧪 Testing

### Backend Tests (Using Jest)

```bash
cd backend
npm test              # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

### Frontend Tests (Using React Testing Library)

```bash
cd frontend
npm test              # Run tests
```

---

## 🐛 Troubleshooting

### Port Already in Use

**Backend (port 5000):**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

**Frontend (port 3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Connection Error

1. Verify MySQL is running
2. Check credentials in `.env`
3. Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`
4. Check MySQL is on correct port (default 3306)

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Error

Make sure:
1. Backend CORS is configured correctly in `server.js`
2. Frontend API URL matches backend URL in `.env`
3. Backend is running on correct port

---

## 📚 Documentation

- [ROADMAP.md](./ROADMAP.md) - Project timeline and phases
- [DESIGN.md](./DESIGN.md) - System architecture and design
- [Backend README](./backend/README.md) - Backend documentation
- [Frontend README](./frontend/README.md) - Frontend documentation

---

## 📋 Next Steps

**Recommended sequence:**

1. **Verify setup** - Ensure backend and frontend run locally
2. **Populate sample data** - Run database/schema.sql which includes sample data
3. **Start Phase 1** - Implement authentication
   - Implement `/signup` endpoint
   - Implement `/login` endpoint
   - Create login/signup forms
   - Test authentication flow
4. **Move to Phase 2** - Project management
5. **Continue with Phase 3+** - Tasks, Dashboard, etc.

---

## 🎯 Success Criteria

✅ Backend server starts without errors
✅ Database connects successfully
✅ All middleware loads correctly
✅ Frontend builds without errors
✅ Sample data exists in database
✅ Health check endpoint responds

---

## 💡 Tips

- **Use Postman** to test API endpoints before creating frontend
- **Enable request logging** to debug issues: Set `LOG_LEVEL=debug` in `.env`
- **Keep tokens short** during development to avoid JWT errors
- **Test with sample data** provided in `database/schema.sql`
- **Use browser DevTools** to inspect network requests and console

---

## 📞 Support

If you encounter issues:

1. Check error messages in terminal/console
2. Verify all prerequisites are installed
3. Check `.env` file for correct configuration
4. Review relevant README files
5. Check database connection

---

## 🎉 You're All Set!

The project is now ready for development. Start with Phase 1 (Authentication) and follow the roadmap.

Good luck with your Team Task Manager project! 🚀
