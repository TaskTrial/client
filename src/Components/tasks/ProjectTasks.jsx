import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaUsers, FaFilter } from "react-icons/fa";

import Toast from "../Toast";
import LoadingOverlay from "../LoadingOverlay";
import { fetchProjectTasks } from "./fetchProjectTasks";
import "../Styles/Tasks.css";

const statusColors = {
  TODO: "#d7b4f3",
  IN_PROGRESS: "#f9da8b",
  REVIEW: "#e4c6c3",
  DONE: "#a6ed9b",
};

const ProjectTasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.user);
  const { tasks } = useSelector((state) => state.task);

  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const projectId = location?.state?.projectId;
  const teamId = location?.state?.teamId;

  useEffect(() => {
    if (!projectId || !teamId) return;
    fetchProjectTasks({
      userData,
      projectId,
      teamId,
      setToast,
      setIsLoading,
      dispatch,
      navigate,
    });
  }, [userData, projectId, teamId, dispatch, navigate]);

  const filteredTasks =
    filterStatus === "ALL"
      ? tasks
      : tasks.filter((t) => t.status === filterStatus);
  const handleBack = () => {
    navigate(`/Home/Projects/${projectId}`, {
      state: {
        projectId: projectId,
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

      <div className="Tasks-container">
        <header className="Tasks-header" onClick={handleBack}>
          <FaArrowLeft className="Tasks-back-icon" />
          <h6>Back</h6>
        </header>

        <div className="Tasks-topbar">
          <h2 className="Tasks-title">Project Tasks</h2>
          <div className="Tasks-actions">
            <p className="Tasks-result">Result: {filteredTasks.length}</p>
            <FaFilter className="Tasks-filter-icon" />
          </div>
        </div>

        <div className="Tasks-filters">
          {["ALL", "TODO", "IN_PROGRESS", "REVIEW", "DONE"].map((status) => (
            <button
              key={status}
              className={`Tasks-status-btn ${
                filterStatus === status ? "active" : ""
              }`}
              onClick={() => setFilterStatus(status)}
              style={{
                backgroundColor:
                  status === "ALL" ? "#61c8d4" : statusColors[status],
              }}
            >
              {status
                .replace("IN_PROGRESS", "In Progress")
                .replace("REVIEW", "In Review")
                .replace("TODO", "To Do")
                .replace("DONE", "Completed")
                .replace("ALL", "All")}
            </button>
          ))}
        </div>

        {/* <div className="Tasks-list">
          {filteredTasks.map((task) => (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate(`/Home/Tasks/${task.id}`, {
                  state: {
                    from: "ProjectTasks",
                    teamId: teamId,
                    projectId: projectId,
                  },
                });
              }}
              className="Tasks-card"
              key={task.id}
            >
              <span
                className="Tasks-dot"
                style={{ backgroundColor: statusColors[task.status] }}
              />
              <div className="Tasks-card-body">
                <h3 className="Tasks-name">{task.title}</h3>
                <p className="Tasks-info">
                  <FaCalendarAlt />
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="Tasks-info">
                <div>
                  <p>projectId: {projectId}</p>
                  <p>teamId: {teamId}</p>
                  <p>taskId: {task.id}</p>
                  <p>Est. Time: {task.estimatedTime}</p>
                  <p>actualTime: {task.actualTime}</p>
                  <p>{task.priority}</p>
                </div>
              </div>
              <div className="Tasks-card-users">
                <FaUsers />
              </div>
            </div>
          ))}
        </div> */}
        {/* modify2 */}
        <div className="Tasks-list">
          <div className="Tasks-mobile-view">
            {filteredTasks.map((task) => (
              <div
                onClick={() => {
                  navigate(`/Home/Tasks/${task.id}`, {
                    state: {
                      from: "Tasks",
                      teamId: task.team.id,
                      projectId: task.project.id,
                    },
                  });
                }}
                className="Tasks-card"
                key={task.id}
              >
                <span
                  className="Tasks-dot"
                  style={{ backgroundColor: statusColors[task.status] }}
                />
                <div className="Tasks-card-body">
                  <h3 className="Tasks-name">{task.title}</h3>
                  <p className="Tasks-info">
                    <FaCalendarAlt />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                  <p className="Tasks-info">team name:{task.team?.name}</p>
                  <p className="Tasks-info">project name:{task.project.name}</p>
                </div>
                <div className="Tasks-info">
                  <div>
                    <p>Est.Time:{task.estimatedTime}</p>
                    <p>Time Left:{task.timeRemaining}</p>
                    <p>{task.priority}</p>
                  </div>
                </div>
                <div className="Tasks-card-users">
                  <FaUsers />
                </div>
              </div>
            ))}
          </div>

          <div className="Tasks-desktop-view">
            {["TODO", "IN_PROGRESS", "REVIEW", "DONE"].map((status) => (
              <div key={status} className={`Tasks-column ${status}`}>
                <h3>
                  {status
                    .replace("IN_PROGRESS", "In Progress")
                    .replace("REVIEW", "In Review")
                    .replace("TODO", "To Do")
                    .replace("DONE", "Completed")}
                </h3>
                {tasks
                  .filter((t) => t.status === status)
                  .map((task) => (
                    <div
                      onClick={() => {
                        navigate(`/Home/Tasks/${task.id}`, {
                          state: {
                            from: "Tasks",
                            teamId: task.team.id,
                            projectId: task.project.id,
                          },
                        });
                      }}
                      className="Tasks-card"
                      key={task.id}
                    >
                      <span
                        className="Tasks-dot"
                        style={{ backgroundColor: statusColors[task.status] }}
                      />
                      <div className="Tasks-card-body">
                        <h3 className="Tasks-name">{task.title}</h3>
                        <p className="Tasks-info">
                          <FaCalendarAlt />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                        <p className="Tasks-info">
                          team name:{task.team?.name}
                        </p>
                        <p className="Tasks-info">
                          project name:{task.project.name}
                        </p>
                      </div>
                      <div className="Tasks-info">
                        <div>
                          <p>Est.Time:{task.estimatedTime}</p>
                          <p>Time Left:{task.timeRemaining}</p>
                          <p>{task.priority}</p>
                        </div>
                      </div>
                      <div className="Tasks-card-users">
                        <FaUsers />
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectTasks;
