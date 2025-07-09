// src/team/TeamProjects.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCalendarAlt, FaExternalLinkAlt, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchTeamProjects } from "./fetchTeamProjects";
import LoadingOverlay from "../LoadingOverlay";
import Toast from "../Toast";
import "../Styles/TeamProjects.css";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
const TeamProjects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const projects = useSelector((state) => state.project.projects);
  const userData = useSelector((state) => state.user);
  const teamId = useMemo(() => location?.state?.teamId, [location.state]);
  useEffect(() => {
    fetchTeamProjects({
      teamId,
      userData,
      setToast,
      setIsLoading,
      dispatch,
      navigate,
    });
  }, [teamId, dispatch, navigate, userData]);
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

      <div className="team-projects-container">
        <header
          className="profile-header"
          onClick={() => {
            navigate(`/Home/Teams/${teamId}`);
          }}
        >
          <FaArrowLeft className="profile-back-icon" />
          <h6 className="profile-title">team</h6>
        </header>
        <h2 className="team-projects-title">Team Projects</h2>
        <div className="team-projects-list">
          {projects.map((project) => (
            <div className="project-card" key={project.id}>
              <div className="project-card-header">
                <div className="project-thumbnail" />
                <button
                  className="project-expand-btn"
                  onClick={() => {
                    navigate(`/Home/Projects/${project.id}`, {
                      state: { from: "TeamProjects", teamId: project.teamId },
                    });
                  }}
                >
                  <FaExternalLinkAlt />
                </button>
              </div>

              <h3 className="project-name">{project.name}</h3>
              <p className="project-info">
                <strong>Start:</strong> <FaCalendarAlt />{" "}
                {new Date(project.startDate).toDateString()}
              </p>
              <p className="project-info">
                <strong>End:</strong> <FaCalendarAlt />{" "}
                {new Date(project.endDate).toDateString()}
              </p>
              <p className="project-info">
                <strong>Status:</strong> {project.status}
              </p>
              <p className="project-info">
                <strong>Progress:</strong> {project.progress}%
              </p>
              <p className="project-info">
                <strong>Budget:</strong> ${project.budget}
              </p>
              <p className="project-info">
                <strong>Priority:</strong> {project.priority}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TeamProjects;
