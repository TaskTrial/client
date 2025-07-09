// src/projects/ProjectDetails.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchProjectDetails } from "./fetchProjectDetails";
import LoadingOverlay from "../LoadingOverlay";
import Toast from "../Toast";
import { FaArrowLeft, FaUserCircle, FaEdit } from "react-icons/fa";
import "../Styles/ProjectDetails.css";
import DeleteProjectButton from "./DeleteProjectButton";
import { useMemo } from "react";
import RestoreTaskButton from "../tasks/RestoreTaskButton";
const ProjectDetails = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const userData = useSelector((state) => state.user);
  const project = useSelector((state) => state.project);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const teamId = useMemo(() => location?.state?.teamId, [location.state]);
  const projectId2 = location?.state?.projectId;
  // const from = location.state?.from;
  console.log(project.members, "members");
  console.log(project.tasks, "tasks");
  useEffect(() => {
    const getProject = async () => {
      await fetchProjectDetails({
        userData,
        projectId: projectId || projectId2,
        teamId,
        setToast,
        setIsLoading,
        dispatch,
        navigate,
      });
    };

    getProject();
  }, [projectId, dispatch, navigate, userData, teamId, projectId2]);
  const handleBack = () => {
    // if (from === "TeamProjects" && teamId) {
    //   navigate(`/Home/TeamProjects`);
    // } else {
    //   navigate("/Home/Projects");
    // }
    navigate("/Home/TeamProjects", {
      state: {
        teamId: teamId,
      },
    });
  };

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

      <div className="project-details-container">
        <header className="project-header" onClick={handleBack}>
          <FaArrowLeft className="project-back-icon" />
          <h6 className="project-header-title">Projects</h6>
        </header>
        <h2>name:{project.name}</h2>
        <p>description:{project.description}</p>
        <p>Status: {project.status}</p>
        <p>Priority: {project.priority}</p>
        <p>Progress: {project.progress}%</p>
        <p>Budget: ${project.budget}</p>
        <p>Start Date: {new Date(project.startDate).toLocaleString()}</p>
        <p>End Date: {new Date(project.endDate).toLocaleString()}</p>
        <p>Created At: {new Date(project.createdAt).toLocaleString()}</p>

        <h3>Members</h3>
        <div className="owners-container">
          {project.members.map((member) => (
            <div key={member.id} className="owner-card">
              {member.user?.profilePic ? (
                <img
                  src={member.user.profilePic}
                  alt="member"
                  className="owner-image"
                />
              ) : (
                <FaUserCircle size={50} className="editproject-avatar-icon" />
              )}
              <div className="owner-info">
                <h3 className="owner-name">
                  {member.user?.firstName} {member.user?.lastName}
                </h3>
                <p className="owner-email">{member.user?.email}</p>
                <p className="owner-role">Role: {member.role}</p>
              </div>
            </div>
          ))}
        </div>
        {project.tasks && project.tasks.length > 0 && (
          <div className="project-tasks-section">
            <h3>Tasks</h3>
            <div className="task-list">
              {project.tasks.map((task) => (
                <div className="task-card" key={task.id}>
                  <h4 className="task-title">{task.title}</h4>
                  <p>
                    Status:
                    <span
                      className={`task-status ${task.status.toLowerCase()}`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                  </p>
                  <p>
                    Priority:
                    <span
                      className={`task-priority ${task.priority.toLowerCase()}`}
                    >
                      {task.priority}
                    </span>
                  </p>
                  <p>Due: {new Date(task.dueDate).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="project-progress-section">
          <h4>Progress</h4>
          <div className="progress-bar-wrapper">
            <div
              className="progress-bar-fill"
              style={{ width: `${project.progress}%` }}
            />
            <span className="progress-label">{project.progress}%</span>
          </div>
        </div>

        <div className="project-timeline">
          <h4>Timeline</h4>
          <div className="timeline-track">
            <span className="timeline-point start">
              {new Date(project.startDate).toDateString()}
            </span>
            <div className="timeline-line" />
            <span className="timeline-point end">
              {new Date(project.endDate).toDateString()}
            </span>
          </div>
        </div>

        <div className="project-actions">
          <div
            className="project-action"
            onClick={() => {
              navigate(`/Home/ProjectTasks`, {
                state: { teamId: teamId, projectId: projectId },
              });
            }}
          >
            <button className="project-button">Tasks of this project</button>
          </div>
          <div
            onClick={() => {
              navigate("/Home/CreateTask", {
                state: {
                  from: "ProjectDetails",
                  teamId: teamId,
                  projectId: projectId,
                },
              });
            }}
            className="project-action"
          >
            <button className="project-button">+ Create Task</button>
          </div>
          <div
            className="project-action"
            onClick={() => navigate(`/Home/Projects/${projectId}/EditProject`)}
          >
            <button className="project-button">
              <FaEdit size={18} />
              Edit Project
            </button>
          </div>
          <div className="project-action">
            <RestoreTaskButton
              projectId={project.id}
              teamId={teamId}
              setToast={setToast}
              setIsLoading={setIsLoading}
            />
            <DeleteProjectButton
              projectId={project.id}
              teamId={teamId}
              setToast={setToast}
              setIsLoading={setIsLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;
