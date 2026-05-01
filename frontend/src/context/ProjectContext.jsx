import React, { createContext, useState, useCallback } from 'react';
import * as projectAPI from '../api/projectAPI';

export const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all projects
   */
  const fetchProjects = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await projectAPI.getAllProjects();
      setProjects(data);
      return data;
    } catch (err) {
      const errorMessage = err.error || err.message || 'Failed to fetch projects';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create project
   */
  const createProject = useCallback(async (name, description) => {
    try {
      setError(null);
      setIsLoading(true);
      const newProject = await projectAPI.createProject(name, description);
      setProjects((prev) => [...prev, newProject]);
      return newProject;
    } catch (err) {
      const errorMessage = err.error || err.message || 'Failed to create project';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get project details
   */
  const getProjectDetails = useCallback(async (projectId) => {
    try {
      setError(null);
      setIsLoading(true);
      const project = await projectAPI.getProjectDetails(projectId);
      setCurrentProject(project);
      return project;
    } catch (err) {
      const errorMessage = err.error || err.message || 'Failed to fetch project';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update project
   */
  const updateProject = useCallback(async (projectId, name, description) => {
    try {
      setError(null);
      setIsLoading(true);
      const updated = await projectAPI.updateProject(projectId, name, description);
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? updated : p))
      );
      if (currentProject?.id === projectId) {
        setCurrentProject(updated);
      }
      return updated;
    } catch (err) {
      const errorMessage = err.error || err.message || 'Failed to update project';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentProject]);

  /**
   * Delete project
   */
  const deleteProject = useCallback(async (projectId) => {
    try {
      setError(null);
      setIsLoading(true);
      await projectAPI.deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
      }
      return true;
    } catch (err) {
      const errorMessage = err.error || err.message || 'Failed to delete project';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentProject]);

  /**
   * Fetch project members
   */
  const fetchProjectMembers = useCallback(async (projectId) => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await projectAPI.getProjectMembers(projectId);
      setMembers(data);
      return data;
    } catch (err) {
      const errorMessage = err.error || err.message || 'Failed to fetch members';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Add member to project
   */
  const addMember = useCallback(async (projectId, userId, role) => {
    try {
      setError(null);
      setIsLoading(true);
      const newMember = await projectAPI.addProjectMember(projectId, userId, role);
      setMembers((prev) => [...prev, newMember]);
      return newMember;
    } catch (err) {
      const errorMessage = err.error || err.message || 'Failed to add member';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Remove member from project
   */
  const removeMember = useCallback(async (projectId, userId) => {
    try {
      setError(null);
      setIsLoading(true);
      await projectAPI.removeProjectMember(projectId, userId);
      setMembers((prev) => prev.filter((m) => m.user_id !== userId));
      return true;
    } catch (err) {
      const errorMessage = err.error || err.message || 'Failed to remove member';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update member role
   */
  const updateRole = useCallback(async (projectId, userId, role) => {
    try {
      setError(null);
      setIsLoading(true);
      const updated = await projectAPI.updateMemberRole(projectId, userId, role);
      setMembers((prev) =>
        prev.map((m) => (m.user_id === userId ? { ...m, role } : m))
      );
      return updated;
    } catch (err) {
      const errorMessage = err.error || err.message || 'Failed to update role';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    projects,
    currentProject,
    members,
    isLoading,
    error,
    fetchProjects,
    createProject,
    getProjectDetails,
    updateProject,
    deleteProject,
    fetchProjectMembers,
    addMember,
    removeMember,
    updateRole,
    clearError,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = React.useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
