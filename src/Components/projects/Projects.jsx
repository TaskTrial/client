import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../LoadingOverlay";
import Toast from "../Toast";
import { fetchProjects } from "./fetchProjects";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaUsers,
  FaExternalLinkAlt,
} from "react-icons/fa";

import "../Styles/Projects.css";

const Projects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const projects = useSelector((state) => state.project.activeProjects);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getProjects = async () => {
      await fetchProjects({
        userData,
        dispatch,
        navigate,
        setToast,
        setIsLoading,
      });
    };

    getProjects();
  }, [dispatch, navigate, userData]);

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="Projects-container">
        <header className="Projects-header" onClick={() => navigate("/Home")}>
          <FaArrowLeft className="Projects-back-icon" />
          <h6>Back</h6>
        </header>

        <h2 className="Projects-title">Projects</h2>
        <p className="Projects-result">Result: {projects.length}</p>

        <div className="Projects-list">
          {projects.map((project) => (
            <div className="Projects-card" key={project.id}>
              <div className="Projects-card-header">
                <div className="Projects-thumbnail" />
                <button
                  className="Projects-expand-btn"
                  onClick={() => {
                    navigate(`/Home/Projects/${project.id}`, {
                      state: { from: "projects", teamId: project.team.id },
                    });
                  }}
                >
                  <FaExternalLinkAlt />
                </button>
              </div>
              <h3 className="Projects-name">{project.name}</h3>
              <p className="Projects-info">
                <strong>Start Date</strong> <FaCalendarAlt />{" "}
                {new Date(project.startDate).toDateString()}
              </p>
              <p className="Projects-info">
                <strong>End Date</strong> <FaCalendarAlt />{" "}
                {new Date(project.endDate).toDateString()}
              </p>
              <p className="Projects-info">
                <strong>Team</strong> <FaUsers /> {project.team.name}
              </p>
              <p className="Projects-description">{project.description}</p>
              <div className="Projects-members">
                {project.members.slice(0, 3).map((member, index) => (
                  <div className="Projects-avatar" key={index}>
                    {member.profilePic ? (
                      <img src={member.profilePic} alt={member.firstName} />
                    ) : (
                      <span>{member.firstName[0]}</span>
                    )}
                  </div>
                ))}
                {project.members.length > 3 && (
                  <span className="Projects-more">
                    +{project.members.length - 3}
                  </span>
                )}
              </div>
              <div className="Projects-footer">
                <div className="Projects-progress">
                  <div
                    className="Projects-progress-bar"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Projects;
