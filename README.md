# TaskFlow - Team Task Manager

A full-stack web application where users can create projects, assign tasks, and track progress with role-based access control (Admin / Member).

---

## 📌 Overview

This project was built as an assignment to implement:

- Authentication (Signup/Login)
- Project & team management
- Task creation, assignment & tracking
- Dashboard with task insights and overdue tracking
- Role-based access control

---

## 🛠 Tech Stack

### Frontend
- React (Hooks + Context API)
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Authentication
- JWT (JSON Web Tokens)

---

## ⚙️ Features

### 🔐 Authentication
- User signup and login
- JWT-based authentication
- Protected routes

### 📁 Project Management
- Create and view projects
- Each project contains tasks and members

### 👥 Team Management
- Add members to projects
- Role-based access:
  - Admin → full control
  - Member → limited permissions

### 📌 Task Management
- Create tasks
- Assign tasks to users
- Set due dates
- Delete tasks

### 🎯 Kanban Board
- Task status columns: Todo, In Progress, Completed
- Drag & drop to update status

### 📊 Dashboard
- Task summary
- Progress tracking
- Overdue task detection

---

## 🧩 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx
│   │   └── PrivateRoute.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ProjectsPage.jsx
│   │   └── ProjectDetailsPage.jsx
│   ├── api/
│   │   ├── authAPI.js
│   │   ├── projectAPI.js
│   │   └── dashboardAPI.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ProjectContext.jsx
│   ├── App.jsx
│   └── index.js
```

---

## 🚀 Setup Instructions

### 1. Clone repository
```bash
git clone <your-repo-link>
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Run the app
```bash
npm start
```
App runs at: `http://localhost:3000`

---

## 🔌 API Endpoints (Examples)

| Method | Endpoint |
|--------|----------|
| POST | /auth/login |
| POST | /projects |
| GET | /projects |
| POST | /projects/:id/tasks |
| PATCH | /projects/:id/tasks/:taskId/status |

---

## 🔐 Security Features

- JWT-based authentication
- Protected frontend routes
- Role-based backend authorization
- Input validation

---

## ⚙️ Key Design Decisions

- Used Context API for global state management
- Implemented Kanban board UI for task tracking
- Used RESTful APIs for backend communication
- Structured backend with controllers, services, and middleware

---

## 📦 Build

```bash
npm run build
```

---

## 🐛 Troubleshooting

**Backend not working:**
- Ensure backend runs on port 5000
- Check `.env` API URL

**Auth issues:**
- Clear localStorage
- Re-login

---

## 🎯 Future Improvements

- Replace react-beautiful-dnd with dnd-kit
- Add real-time updates (WebSockets)
- Add notifications system
- Add activity logs

---

## 👩‍💻 Author

Anjali

---

## 📄 License

MIT