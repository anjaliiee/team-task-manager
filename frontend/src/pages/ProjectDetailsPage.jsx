import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import AddMemberModal from '../components/AddMemberModal';

export const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    currentProject,
    members,
    isLoading,
    error,
    clearError,
    getProjectDetails,
    fetchProjectMembers,
    removeMember,
    updateRole,
  } = useProject();

  const [showAddMember, setShowAddMember] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);

  useEffect(() => {
    getProjectDetails(projectId);
    fetchProjectMembers(projectId);
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h2>
          <button
            onClick={() => navigate('/projects')}
            className="text-blue-600 hover:text-blue-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = members.some((m) => m.user_id === user.user_id && m.role === 'admin');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/projects')}
              className="text-blue-600 hover:text-blue-700 mb-2"
            >
              ← Back to Projects
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{currentProject.name}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-700 text-sm mt-2"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <p className="text-gray-600">
                    {currentProject.description || 'No description provided'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created
                  </label>
                  <p className="text-gray-600">
                    {new Date(currentProject.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Members Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
              {isAdmin && (
                <button
                  onClick={() => setShowAddMember(true)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                >
                  + Add
                </button>
              )}
            </div>
            <div className="space-y-3">
              {members.length === 0 ? (
                <p className="text-gray-600 text-sm">No members yet</p>
              ) : (
                members.map((member) => (
                  <div
                    key={member.user_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                        {member.role}
                      </span>
                      {isAdmin && member.user_id !== user.user_id && (
                        <button
                          onClick={() => removeMember(projectId, member.user_id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <AddMemberModal
          projectId={projectId}
          onClose={() => setShowAddMember(false)}
          onSuccess={() => {
            setShowAddMember(false);
            fetchProjectMembers(projectId);
          }}
        />
      )}
    </div>
  );
};

export default ProjectDetailsPage;
