/* eslint-disable react/prop-types */
import { MdRestore } from "react-icons/md";
import ConfirmModal from "../ConfirmModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccessToken from "../auth/AccessToken";
import { useSelector, useDispatch } from "react-redux";

const RestoreProjectButton = ({ setToast, setIsLoading }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetProjectId, setTargetProjectId] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const teamId = useSelector((state) => state.team.team.id);
  const orgId = localStorage.getItem("orgId");
  const projectId = targetProjectId.trim();

  const handleRestoreProject = async (retried = false) => {
    if (!projectId) {
      setToast({ message: "Please enter a project ID.", type: "error" });
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/organization/${orgId}/team/${teamId}/project/${projectId}/restore`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setToast({
          message: data.message || "Project restored successfully.",
          type: "success",
        });
        setShowConfirm(false);
        setTargetProjectId("");
      } else if (data.message === "Token expired" && !retried) {
        const newAccessToken = await AccessToken({
          userData,
          dispatch,
          navigate,
          setToast,
        });

        if (newAccessToken) {
          userData.accessToken = newAccessToken;
          await handleRestoreProject(true);
        } else {
          setToast({ message: "Could not refresh session.", type: "error" });
        }
      } else {
        setToast({ message: data.message || "Restore failed.", type: "error" });
      }
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showConfirm && (
        <ConfirmModal
          message={
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <p style={{ margin: 0 }}>
                Are you sure you want to restore this project?
              </p>
              <input
                type="text"
                placeholder="Enter Project ID"
                value={targetProjectId}
                onChange={(e) => setTargetProjectId(e.target.value)}
                style={{
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
            </div>
          }
          onConfirm={handleRestoreProject}
          onCancel={() => {
            setShowConfirm(false);
            setTargetProjectId("");
          }}
        />
      )}

      <div
        onClick={() => setShowConfirm(true)}
        style={{
          marginTop: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#28a745",
          padding: "10px 16px",
          borderRadius: "8px",
          cursor: "pointer",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "14px",
          width: "fit-content",
          gap: "8px",
        }}
      >
        <MdRestore size={18} />
        Restore Project
      </div>
    </>
  );
};

export default RestoreProjectButton;
