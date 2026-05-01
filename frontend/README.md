# Team Task Manager - Frontend

React-based frontend for Team Task Manager application.

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## 🚀 Quick Start

### 1. Installation

```bash
cd frontend
npm install
```

### 2. Environment Setup

Create a `.env` file by copying `.env.example`:

```bash
cp .env.example .env
```

Update the `.env` file with your API URL:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm start
```

Application will open at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Forms/           # Form components
│   │   ├── Cards/           # Card components
│   │   ├── Modals/          # Modal dialogs
│   │   ├── Lists/           # List components
│   │   └── Navigation/      # Navigation components
│   │
│   ├── pages/               # Page components
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ProjectsPage.jsx
│   │   ├── ProjectDetailsPage.jsx
│   │   ├── TasksPage.jsx
│   │   └── SettingsPage.jsx
│   │
│   ├── api/                 # API integration
│   │   ├── authAPI.js       # Auth endpoints
│   │   ├── projectAPI.js    # Project endpoints
│   │   ├── taskAPI.js       # Task endpoints
│   │   └── userAPI.js       # User endpoints
│   │
│   ├── context/             # React Context
│   │   ├── AuthContext.jsx  # Auth state
│   │   ├── ProjectContext.jsx
│   │   └── TaskContext.jsx
│   │
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useProjects.js
│   │   └── useTasks.js
│   │
│   ├── styles/              # Global styles
│   │   ├── index.css
│   │   └── tailwind.css
│   │
│   ├── App.jsx              # Root component
│   ├── index.js             # Entry point
│   └── config.js            # Configuration
│
├── public/                  # Static assets
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🎨 Available Pages

- **Login Page** - User authentication
- **Signup Page** - User registration
- **Dashboard** - Personal task summary and overview
- **Projects** - List of all projects
- **Project Details** - Project members and tasks
- **Tasks** - Task management and filtering
- **Settings** - User preferences and account

## 🔌 API Integration

### Authentication

```javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Store token
localStorage.setItem('token', response.data.token);
```

### Protected Routes

```javascript
// Add token to all requests
const response = await fetch('/api/projects', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 🎯 Key Features

- ✅ User authentication (signup/login)
- ✅ Create and manage projects
- ✅ Add team members with roles
- ✅ Create and assign tasks
- ✅ Update task status
- ✅ View project dashboard
- ✅ Task filtering and sorting
- ✅ Responsive design

## 🧪 Testing

```bash
npm test
```

## 📦 Build for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

## 🚢 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload build folder to Netlify
```

### Deploy to AWS S3 + CloudFront

```bash
npm run build
# Upload to S3 and configure CloudFront
```

## 🔒 Security Features

- ✅ JWT token storage in localStorage
- ✅ Protected routes (redirect to login if not authenticated)
- ✅ Input validation on forms
- ✅ CORS handling
- ✅ XSS protection (React escaping)

## 📚 Documentation

- [Design Document](../DESIGN.md) - System architecture
- [Roadmap](../ROADMAP.md) - Project timeline
- [Backend README](../backend/README.md) - Backend documentation

## 👨‍💻 Development

### Code Style

- Use functional components with Hooks
- Use React Context for state management
- Use custom hooks for reusable logic
- Organize components by feature

### Component Structure

```javascript
import React, { useState } from 'react';

export default function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(null);

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

## 🐛 Troubleshooting

### Port 3000 already in use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Backend not responding

- Check backend is running on port 5000
- Verify `REACT_APP_API_URL` is correct
- Check CORS is enabled on backend

### Token errors

- Clear localStorage
- Log out and log back in
- Check JWT_SECRET matches between frontend and backend

## 📄 License

MIT

## 👥 Support

For issues and questions, please open an issue on GitHub.
