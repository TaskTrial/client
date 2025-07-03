// src/tasks/EditTask.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingOverlay from "../LoadingOverlay";
import Toast from "../Toast";
import AccessToken from "../auth/AccessToken";
import "../Styles/EditTask.css";
import { FaArrowLeft, FaTasks } from "react-icons/fa";
import TaskPriorityUpdater from "./TaskPriorityUpdater";
import TaskStatusUpdater from "./TaskStatusUpdater";
const EditTask = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const userData = useSelector((state) => state.user);
  const project = useSelector((state) => state.project);
  const taskId = location.state?.taskId;
  const teamId = location.state?.teamId;
  const projectId = location.state?.projectId;
  const orgId = localStorage.getItem("orgId");

  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    dueDate: "",
    priority: "",
    assignedTo: "",
    estimatedTime: 0,
    labels: "",
  });

  const projectMembers = project?.members || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "estimatedTime" ? Math.min(10, Math.max(0, +value)) : value,
    }));
  };

  const handleSubmit = async (e, retried = false) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    const parsedEstimatedTime = Number(formData.estimatedTime);
    const parsedLabels = formData.labels
      .split(",")
      .map((l) => l.trim())
      .filter((l) => l);

    const beforePayload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status.trim(),
      dueDate: formData.dueDate.trim(),
      priority: formData.priority.trim(),
      assignedTo: formData.assignedTo.trim(),
      estimatedTime:
        !isNaN(parsedEstimatedTime) && parsedEstimatedTime > 0
          ? parsedEstimatedTime
          : "",
      labels: parsedLabels,
    };

    const payload = Object.fromEntries(
      Object.entries(beforePayload).filter(([, v]) =>
        Array.isArray(v) ? v.length > 0 : v !== ""
      )
    );
    if (Object.keys(payload).length === 0) {
      return setToast({
        message: "Please enter data to update the task.",
        type: "error",
      });
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/organization/${orgId}/team/${teamId}/project/${projectId}/task/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setToast({ message: data.message || "Task updated", type: "success" });
        setTimeout(() => {
          navigate(`/Home/Tasks/${taskId}`);
        }, 1500);
      } else if (data.message === "Token expired" && !retried) {
        const newToken = await AccessToken({
          userData,
          dispatch,
          navigate,
          setToast,
        });
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          await handleSubmit(e, true);
        }
      } else {
        setToast({ message: data.message || "Update failed", type: "error" });
      }
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="edittask-container">
      <LoadingOverlay isLoading={isLoading} />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <header
        className="edittask-header"
        onClick={() => navigate(`/Home/Tasks/${taskId}`)}
      >
        <FaArrowLeft className="edittask-back-icon" />
        <h6>Back</h6>
      </header>
      <h2 className="edittask-title">
        <FaTasks className="edittask-icon" /> Edit Task
      </h2>
      <form className="edittask-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input name="title" value={formData.title} onChange={handleChange} />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>

        <label>
          Status
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="">-- Select --</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="DONE">Done</option>
          </select>
        </label>

        <label>
          Priority
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="">-- Select --</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </label>

        <label>
          Assign To
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
          >
            <option value="">-- Select --</option>
            {projectMembers
              .filter((m) => m.role !== "PROJECT_OWNER")
              .map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.user.firstName} {m.user.lastName}
                </option>
              ))}
          </select>
        </label>

        <label>
          Due Date
          <input
            type="datetime-local"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </label>

        <label>
          estimatedTime
          <input
            type="number"
            name="estimatedTime"
            value={formData.estimatedTime}
            onChange={handleChange}
            min="0"
            max="10"
          />
        </label>

        <label>
          Labels (comma-separated)
          <input
            name="labels"
            value={formData.labels}
            onChange={handleChange}
          />
        </label>

        <button
          type="submit"
          className="edittask-save-button"
          disabled={isLoading}
        >
          Update Task
        </button>
      </form>
      <h3 style={{ color: "#555", textAlign: "center", marginBlock: "10px" }}>
        another services :fast action
      </h3>
      <TaskStatusUpdater
        teamId={teamId}
        projectId={projectId}
        taskId={taskId}
      />
      <TaskPriorityUpdater
        teamId={teamId}
        projectId={projectId}
        taskId={taskId}
      />
    </div>
  );
};

export default EditTask;
