# Team Task Manager - Backend API

REST API backend for the Team Task Manager application built with Node.js and Express.

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MySQL >= 5.7 or PostgreSQL >= 12
- Git

## 🚀 Quick Start

### 1. Installation

```bash
cd backend
npm install
```

### 2. Environment Setup

Create a `.env` file by copying `.env.example`:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=team_task_manager
JWT_SECRET=your_secure_secret_key
```

### 3. Database Setup

```bash
# Create database
mysql -u root -p < database/schema.sql

# Or use a GUI like MySQL Workbench
```

### 4. Start Development Server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # Database connection
│   │   ├── env.js        # Environment variables
│   │   └── constants.js  # Constants
│   │
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # JWT verification
│   │   ├── rbac.js       # Role-based access control
│   │   ├── validation.js # Input validation
│   │   └── errorHandler.js
│   │
│   ├── routes/           # API route definitions
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── userRoutes.js
│   │   └── dashboardRoutes.js
│   │
│   ├── controllers/      # Request handlers
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   ├── userController.js
│   │   └── dashboardController.js
│   │
│   ├── models/           # Database queries
│   │   ├── userModel.js
│   │   ├── projectModel.js
│   │   ├── taskModel.js
│   │   └── projectMemberModel.js
│   │
│   ├── validations/      # Input validation schemas
│   │   ├── authValidation.js
│   │   ├── projectValidation.js
│   │   └── taskValidation.js
│   │
│   ├── utils/            # Utility functions
│   │   ├── jwt.js        # JWT helpers
│   │   ├── bcrypt.js     # Password hashing
│   │   ├── response.js   # Response formatter
│   │   └── logger.js
│   │
│   └── server.js         # Express app entry point
│
├── database/
│   └── schema.sql        # Database schema
│
├── tests/                # Test files
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### How it works:

1. **Signup/Login:** User sends credentials
2. **Token Generation:** Server returns JWT token
3. **Protected Routes:** Client includes token in Authorization header
   ```
   Authorization: Bearer <jwt_token>
   ```
4. **Verification:** Server verifies token on each request

### Token Structure:

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "user_id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "iat": 1640000000,
    "exp": 1640003600
  }
}
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all user's projects
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)

### Team Members
- `POST /api/projects/:id/members` - Add member (admin only)
- `GET /api/projects/:id/members` - Get project members
- `DELETE /api/projects/:id/members/:userId` - Remove member (admin only)
- `PUT /api/projects/:id/members/:userId` - Update member role (admin only)

### Tasks
- `POST /api/projects/:id/tasks` - Create task
- `GET /api/projects/:id/tasks` - Get project tasks
- `GET /api/projects/:id/tasks/:taskId` - Get task details
- `PUT /api/projects/:id/tasks/:taskId` - Update task
- `DELETE /api/projects/:id/tasks/:taskId` - Delete task
- `PATCH /api/projects/:id/tasks/:taskId/status` - Update task status

### Task Comments
- `POST /api/projects/:id/tasks/:taskId/comments` - Add comment
- `GET /api/projects/:id/tasks/:taskId/comments` - Get comments
- `DELETE /api/projects/:id/tasks/:taskId/comments/:commentId` - Delete comment

### Dashboard
- `GET /api/dashboard/summary` - Get user dashboard summary
- `GET /api/projects/:id/dashboard` - Get project dashboard
- `GET /api/tasks/overdue` - Get overdue tasks

## 📊 Response Format

### Success Response

```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "status": 400,
  "error": "VALIDATION_ERROR",
  "message": "Email is required",
  "details": {
    "email": "Email is required"
  }
}
```

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Generate Coverage Report

```bash
npm run test:coverage
```

## 🔒 Security Features

- ✅ JWT authentication
- ✅ Bcrypt password hashing (10 rounds)
- ✅ Role-based access control (RBAC)
- ✅ Input validation with Joi
- ✅ CORS protection
- ✅ Helmet for security headers
- ✅ Parameterized SQL queries (prevent SQL injection)
- ✅ Rate limiting (recommended)

## 📦 Dependencies

- **express** - Web framework
- **mysql2** - MySQL database driver
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **joi** - Input validation
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **morgan** - HTTP request logger
- **dotenv** - Environment variables

## 🚢 Deployment

### Production Checklist

- [ ] Update `.env` with production values
- [ ] Use strong JWT secret (min 32 characters)
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Set `NODE_ENV=production`
- [ ] Use production database
- [ ] Set up logging/monitoring
- [ ] Configure CORS for frontend domain
- [ ] Enable rate limiting
- [ ] Set up CI/CD pipeline

### Deploy to Heroku

```bash
heroku login
heroku create team-task-manager-api
git push heroku main
```

## 📝 Environment Variables

See `.env.example` for all available environment variables.

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5000
npx kill-port 5000
```

### Database Connection Error

```bash
# Check MySQL is running
# Verify DB credentials in .env
# Ensure database exists
```

### JWT Token Invalid

- Check `JWT_SECRET` is set correctly
- Verify token hasn't expired
- Ensure token is in correct format in Authorization header

## 📚 Documentation

- [Design Document](../DESIGN.md) - System architecture and design
- [Roadmap](../ROADMAP.md) - Project timeline and phases

## 👨‍💻 Development

### Code Style

- Use 2-space indentation
- Use async/await for async operations
- Always validate inputs
- Always check permissions

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes
git add .
git commit -m "feat: Add new feature"

# Create pull request
git push origin feature/feature-name
```

## 📄 License

MIT

## 👥 Support

For issues and questions, please open an issue on GitHub.
