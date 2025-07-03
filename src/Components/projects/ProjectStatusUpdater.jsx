/* eslint-disable react/prop-types */
import { useState } from "react";
import Toast from "../Toast";
import LoadingOverlay from "../LoadingOverlay";
import "../Styles/ProjectStatusUpdater.css";
import { useNavigate } from "react-router-dom";
import AccessToken from "../auth/AccessToken";
import { useDispatch, useSelector } from "react-redux";

const ProjectStatusUpdater = ({ projectId }) => {
  const teamId = useSelector((state) => state.team.team.id);
  const orgId = localStorage.getItem("orgId");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);

  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleStatusChange = async (e, retried = false) => {
    const newStatus = e.target.value;
    if (!newStatus) return;
    setStatus(newStatus);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:3000/api/organization/${orgId}/team/${teamId}/project/${projectId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setToast({ message: "Status updated successfully", type: "success" });
      } else if (data.message === "Token expired" && !retried) {
        const newToken = await AccessToken({
          userData,
          dispatch,
          navigate,
          setToast,
        });
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          await handleStatusChange(e, true);
        }
      } else {
        setToast({
          message: data.message || "Failed to update status",
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
    <div className="project-status-updater">
      <LoadingOverlay isLoading={isLoading} />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <label htmlFor="status-select">Update Status:</label>
      <select id="status-select" value={status} onChange={handleStatusChange}>
        <option value="">-- Select Status --</option>
        <option value="PLANNING">Planning</option>
        <option value="ACTIVE">Active</option>
        <option value="COMPLETED">Completed</option>
      </select>
    </div>
  );
};

export default ProjectStatusUpdater;
