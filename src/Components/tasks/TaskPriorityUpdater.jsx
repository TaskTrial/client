/* eslint-disable react/prop-types */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Toast from "../Toast";
import LoadingOverlay from "../LoadingOverlay";
import { useNavigate } from "react-router-dom";
import AccessToken from "../auth/AccessToken";

const TaskPriorityUpdater = ({ teamId, projectId, taskId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orgId = localStorage.getItem("orgId");
  const [priority, setPriority] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const userData = useSelector((state) => state.user);

  const handlePriorityChange = async (e, retried = false) => {
    const newPriority = e.target.value;
    if (!newPriority) return;

    setPriority(newPriority);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:3000/api/organization/${orgId}/team/${teamId}/project/${projectId}/task/${taskId}/priority`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ priority: newPriority }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setToast({ message: "Priority updated successfully", type: "success" });
      } else if (data.message === "Token expired" && !retried) {
        const newToken = await AccessToken({
          userData,
          dispatch,
          navigate,
          setToast,
        });
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          await handlePriorityChange(e, true);
        }
      } else {
        setToast({
          message: data.message || "Failed to update priority",
          type: "error",
        });
      }
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="project-priority-updater">
      <LoadingOverlay isLoading={isLoading} />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <label htmlFor="priority-select">Update Priority:</label>
      <select
        id="priority-select"
        value={priority}
        onChange={handlePriorityChange}
      >
        <option value="">-- Select Priority --</option>
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
      </select>
    </div>
  );
};

export default TaskPriorityUpdater;
