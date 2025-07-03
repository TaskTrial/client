import "../Styles/Dashboard.css";
import { FaChartLine, FaTasks, FaCalendarAlt } from "react-icons/fa";
import { MdAccessTime, MdWork } from "react-icons/md";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../LoadingOverlay";
import Toast from "../Toast";
import { fetchProjects } from "../projects/fetchProjects";
import { fetchTasks } from "../tasks/fetchTasks";
import { FiBell } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const project = useSelector((state) => state.project);
  const task = useSelector((state) => state.task);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const profilePic = userData.profilePic;
  const goToProfile = () => {
    navigate("/Home/Profile");
  };
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
  useEffect(() => {
    fetchTasks({
      userData,
      setToast,
      setIsLoading,
      dispatch,
      navigate,
    });
  }, [dispatch, userData, navigate]);
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

      <div className="Dashboard">
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          <div className="dashboard-header-right">
            <FiBell className="dashboard-icon" />
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="dashboard-profile-iconBack"
                onClick={goToProfile}
              />
            ) : (
              <FaUserCircle
                size={50}
                className="dashboard-profile-icon"
                onClick={goToProfile}
              />
            )}
          </div>
        </div>
        <div className="dashboard-overview-wrapper">
          <div className="dashboard-card">
            <div className="dashboard-icon">
              <FaChartLine color="#b388f0" size={24} />
            </div>
            <h3 className="dashboard-title">Total revenue</h3>
            <p className="dashboard-value">$53,00989</p>
            {/* <p
            className={`dashboard-status ${
              card.statusColor === "green"
                ? "dashboard-status-up"
                : "dashboard-status-down"
            }`}
          >
            {card.status}
          </p> */}
          </div>
          <div className="dashboard-card">
            <div className="dashboard-icon">
              <MdWork color="#f7a07a" size={24} />
            </div>
            <h3 className="dashboard-title">Projects</h3>
            <p className="dashboard-value">
              totalActiveProjects:
              {project.statistics.totalActiveProjects || 0}
            </p>
            <p className="dashboard-value">
              totalArchivedProjects:
              {project.statistics.totalArchivedProjects || 0}
            </p>
            <p className="dashboard-value">
              totalProjects:{project.statistics.totalProjects || 0}
            </p>
            {/* <p
            className={`dashboard-status ${
              card.statusColor === "green"
                ? "dashboard-status-up"
                : "dashboard-status-down"
            }`}
          >
            {card.status}
          </p> */}
          </div>
          <div className="dashboard-card">
            <div className="dashboard-icon">
              <MdAccessTime color="#89bdfb" size={24} />
            </div>
            <h3 className="dashboard-title">Time spent</h3>
            <p className="dashboard-value">1022 /1300 Hrs</p>
            {/* <p
            className={`dashboard-status ${
              card.statusColor === "green"
                ? "dashboard-status-up"
                : "dashboard-status-down"
            }`}
          >
            {card.status}
          </p> */}
          </div>
          <div className="dashboard-card">
            <div className="dashboard-icon">
              <FaTasks color="#a88fed" size={24} />
            </div>
            <h3 className="dashboard-title">Tasks</h3>
            <p className="dashboard-value">
              totalTasks:{task.statistics?.totalTasks || 0}
            </p>
            <p className="dashboard-value">
              {task.statistics?.byStatus ? (
                <>
                  byStatus:
                  <div className="todo">
                    todo: {task.statistics.byStatus.todo || 0}
                  </div>
                  <div className="in_progress">
                    in_progress: {task.statistics.byStatus.inProgress || 0}
                  </div>
                  <div className="review">
                    review: {task.statistics.byStatus.review || 0}
                  </div>
                  <div className="done">
                    done: {task.statistics.byStatus.done || 0}
                  </div>
                </>
              ) : (
                <p>Loading task statuses...</p>
              )}
            </p>
            <p className="dashboard-value">
              {task.statistics?.byPriority ? (
                <>
                  byPriority:
                  <div className="completed">
                    low: {task.statistics.byPriority.low || 0}
                  </div>
                  <div className="in_progress">
                    medium: {task.statistics.byPriority.medium || 0}
                  </div>
                  <div className="review">
                    high: {task.statistics.byPriority.high || 0}
                  </div>
                </>
              ) : (
                <p>Loading task priorities...</p>
              )}
            </p>
            <p className="dashboard-value">
              overdue:{task.statistics?.overdue || 0}
            </p>
            {/* <p
            className={`dashboard-status ${
              card.statusColor === "green"
                ? "dashboard-status-up"
                : "dashboard-status-down"
            }`}
          >
            {card.status}
          </p> */}
          </div>
        </div>
        <div className="dashboard-container">
          <div className="dashboard-projects-wrapper">
            <h2>Project Summary</h2>
            {Array.isArray(project.activeProjects) &&
              project.activeProjects.map((project) => (
                <div key={project.id} className="project-row">
                  <span>
                    <div>
                      {project.name} <FaCalendarAlt />
                    </div>
                    <div>{new Date(project.endDate).toDateString()}</div>
                  </span>

                  <span className={`status ${project.status.toLowerCase()}`}>
                    {project.status}
                  </span>
                  <span
                    className={`progress-ring ${project.status.toLowerCase()}`}
                    style={{ "--progress": `${project.progress}%` }}
                  >
                    <span className="progress-ring-inner">
                      {project.progress}%
                    </span>
                  </span>
                  {/* <span className={`progress-circle ${project.progress}`}>
                    {project.progress}%
                  </span> */}
                </div>
              ))}
            {Array.isArray(project.archivedProjects) &&
              project.archivedProjects.map((project) => (
                <div key={project.id} className="project-row">
                  <span>
                    <div>
                      {project.name} <FaCalendarAlt />
                    </div>
                    <div>{new Date(project.endDate).toDateString()}</div>
                  </span>
                  <span className={`status ${project.status.toLowerCase()}`}>
                    {project.status}
                  </span>
                  <span
                    className={`progress-ring ${project.status.toLowerCase()}`}
                    style={{ "--progress": `${project.progress}%` }}
                  >
                    <span className="progress-ring-inner">
                      {project.progress}%
                    </span>
                  </span>
                </div>
              ))}
          </div>
          {/* /////////////////tasks//////////////////// */}
          <div className="dashboard-tasks-wrapper">
            <h2>Tasks Summary</h2>
            {Array.isArray(task.tasks) &&
              task.tasks.map((task) => (
                <div key={task.id} className="task-row">
                  <span>
                    <div>
                      {task.title} <FaCalendarAlt />
                    </div>
                    <div>{new Date(task.dueDate).toDateString()}</div>
                  </span>

                  <span className={`status ${task.status.toLowerCase()}`}>
                    {task.status}
                  </span>
                  <span
                    className={`progress-ring ${task.status.toLowerCase()}`}
                    style={{ "--progress": `${task.progress}%` }}
                  >
                    <span className="progress-ring-inner">
                      {task.progress}%
                    </span>
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
