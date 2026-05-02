import React, { useEffect, useState } from 'react';
import { getAllProjects, createProject } from '../api/projectAPI';
import { useNavigate } from 'react-router-dom';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const navigate = useNavigate();

  // LOAD PROJECTS
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getAllProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load projects error:", err);
    }
  };

  // CREATE PROJECT
  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      alert("Project name is required");
      return;
    }

    try {
      await createProject({
        name: projectName.trim(),
        description: projectDescription.trim(),
      });

      // reset fields
      setProjectName('');
      setProjectDescription('');
      setShowModal(false);

      loadProjects();
    } catch (err) {
      console.error("Create project error:", err);
      alert("Failed to create project");
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Projects</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition"
        >
          + New Project
        </button>
      </div>

      {/* EMPTY STATE */}
      {projects.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          No projects yet. Create your first one 🚀
        </div>
      )}

      {/* PROJECT LIST */}
      <div className="grid grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 cursor-pointer hover:scale-105 transition"
          >
            <h2 className="text-xl font-semibold">
              {project.name}
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              {project.description || 'No description'}
            </p>
          </div>
        ))}
      </div>

      {/* 🔥 MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          onClick={() => setShowModal(false)} // click outside to close
        >
          <div
            className="bg-[#2a2a40] border border-white/10 rounded-2xl p-6 w-[420px] shadow-2xl"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <h2 className="text-xl font-semibold mb-4">
              Create New Project
            </h2>

            {/* NAME INPUT */}
            <input
              type="text"
              placeholder="Project name..."
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 mb-4 outline-none focus:ring-2 focus:ring-primary"
            />

            {/* DESCRIPTION INPUT */}
            <textarea
              placeholder="Project description (optional)..."
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 mb-4 outline-none focus:ring-2 focus:ring-primary resize-none"
            />

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateProject}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary hover:scale-105 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectsPage;