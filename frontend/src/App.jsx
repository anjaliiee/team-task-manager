import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';

// Placeholder Dashboard for testing
const DashboardPage = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-gray-900">Team Task Manager</h1>
            <div className="flex gap-6">
              <a href="/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</a>
              <a href="/projects" className="text-gray-700 hover:text-gray-900">Projects</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <p className="text-gray-600 mb-4">Welcome to Team Task Manager!</p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-800">
              <strong>Phase 1 & 2 Complete:</strong> You can now create projects and manage teams!
            </p>
          </div>
          
          <div className="space-y-2">
            <p><strong>User ID:</strong> {user?.user_id}</p>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
          </div>

          <div className="mt-6 pt-6 border-t">
            <a
              href="/projects"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              Go to Projects →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

function AppContent() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/projects"
        element={
          <PrivateRoute>
            <ProjectsPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/projects/:projectId"
        element={
          <PrivateRoute>
            <ProjectDetailsPage />
          </PrivateRoute>
        }
      />
      
      {/* Redirect root to dashboard if authenticated, otherwise to login */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProjectProvider>
          <AppContent />
        </ProjectProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
