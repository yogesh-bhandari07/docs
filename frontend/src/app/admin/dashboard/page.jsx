"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import AddProjectModal from "@/components/AddProjectModal";
import { apiRequest } from "@/services/api";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

export default function Dashboard() {
  const [projects, setProjects] = useState([]); // ✅ Initialize as empty array
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiRequest("projects", "GET");
        setProjects(response || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const addProject = (newProject) => {
    setProjects([...projects, newProject]);
    setShowModal(false);
  };

  if (loading) return <SkeletonLoader />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div>
      <Navbar onAddProject={() => setShowModal(true)} />

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {projects?.length > 0 ? (
          projects.map((project) => (
            <div
              key={project._id}
              className="bg-white shadow-lg rounded-lg p-4 border"
              style={{ borderColor: project.colorTheme }}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={project.logoUrl}
                  alt="Logo"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h2 className="text-lg font-bold">{project.name}</h2>
                  <a
                    href={project.url}
                    target="_blank"
                    className="text-sm text-blue-500"
                  >
                    {project.url}
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <span className="px-3 py-1 rounded bg-gray-200">
                  {project.colorTheme}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No projects found.
          </p>
        )}
      </div>

      {/* Add Project Modal */}
      {showModal && (
        <AddProjectModal
          onClose={() => setShowModal(false)}
          onSave={addProject}
        />
      )}
    </div>
  );
}
