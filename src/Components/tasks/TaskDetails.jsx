// src/tasks/TaskDetails.jsx
import { useEffect, useState } from "react";
import { fetchTaskDetails } from "./fetchTaskDetails";
import LoadingOverlay from "../LoadingOverlay";
import Toast from "../Toast";
import "../Styles/TaskDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DeleteTaskButton from "./DeleteTaskButton";
import { FaArrowLeft, FaUserCircle, FaEdit } from "react-icons/fa";

const TaskDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: taskId } = useParams();
  const { projectId, teamId } = location.state || {};
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const task = useSelector((state) => state.task);
  const userData = useSelector((state) => state.userData);
  const from = location.state?.from;

  useEffect(() => {
    if (!taskId || !projectId || !teamId) return;
    fetchTaskDetails({
      userData,
      taskId,
      projectId,
      teamId,
      navigate,
      dispatch,
      setToast,
      setIsLoading,
    });
  }, [taskId, projectId, teamId, navigate, dispatch, userData]);
  const handleBack = () => {
    if (from === "Tasks") {
      navigate(`/Home/Tasks`);
    } else {
      navigate("/Home/ProjectTasks");
    }
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

      {task && (
        <div className="task-details-container">
          <header className="task-header" onClick={handleBack}>
            <FaArrowLeft className="task-back-icon" />
            <h6 className="task-header-title">Back</h6>
          </header>

          <h2 className="task-title">{task.title}</h2>
          <p className="task-description">{task.description}</p>

          <div className="task-info-group">
            <p>
              <strong>Status:</strong> {task.status.replace("_", " ")}
            </p>
            <p>
              <strong>Priority:</strong> {task.priority}
            </p>
            <p>
              <strong>Estimated Time:</strong> {task.estimatedTime}h
            </p>
            <p>
              <strong>Due Date:</strong>
              {new Date(task.dueDate).toLocaleString()}
            </p>
            <p>
              <strong>createdAt:</strong>
              {new Date(task.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>updatedAt:</strong>
              {new Date(task.updatedAt).toLocaleString()}
            </p>
          </div>

          <div className="task-info-group">
            <h4>Assignee</h4>
            <div className="task-user">
              {task.assignee?.profilePic ? (
                <img
                  src={task.assignee.profilePic}
                  alt="assignee"
                  className="task-user-pic"
                />
              ) : (
                <FaUserCircle className="task-user-icon" size={40} />
              )}
              <div>
                <p>
                  {task.assignee?.firstName} {task.assignee?.lastName}
                </p>
                <p>{task.assignee?.email}</p>
              </div>
            </div>
          </div>

          <div className="task-info-group">
            <h4>Creator</h4>
            <p>
              {task.creator?.firstName} {task.creator?.lastName}
            </p>
            <p>{task.creator?.email}</p>
          </div>
          <div
            className="project-action"
            onClick={() =>
              navigate(`/Home/Tasks/${taskId}/EditTask`, {
                state: {
                  taskId,
                  projectId,
                  teamId,
                },
              })
            }
          >
            <button className="project-button">
              <FaEdit size={18} />
              Edit Task
            </button>
          </div>
          <DeleteTaskButton
            projectId={projectId}
            teamId={teamId}
            taskId={taskId}
            setToast={setToast}
            setIsLoading={setIsLoading}
          />
        </div>
      )}
    </>
  );
};

export default TaskDetails;
