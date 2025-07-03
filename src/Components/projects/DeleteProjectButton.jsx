/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import AccessToken from "../auth/AccessToken";
import ConfirmModal from "../ConfirmModal";

const DeleteProjectButton = ({ projectId, teamId, setToast, setIsLoading }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const orgId = localStorage.getItem("orgId");
  const handleDelete = async (retried = false) => {
    setIsLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `http://localhost:3000/api/organization/${orgId}/team/${teamId}/project/${projectId}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        setToast({
          message: data.message || "Project deleted",
          type: "success",
        });
        setTimeout(() => {
          navigate(-1);
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
          await handleDelete(true);
        }
      } else {
        setToast({ message: data.message || "Delete failed", type: "error" });
      }
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this project?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div
        onClick={() => setShowConfirm(true)}
        style={{
          marginTop: "16px",
          display: "flex",
          justifyContent: "center",
          marginBottom: "16px",
          width: "100%",
        }}
      >
        <button
          style={{
            backgroundColor: "#dc3545",
            width: "100%",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            justifyContent: "center",
            fontSize: "0.95rem",
            transition: "background-color 0.3s, transform 0.2s",
            boxShadow: "0 2px 6px rgba(255, 152, 0, 0.3)",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
        >
          <FaTrash />
          Delete Project
        </button>
      </div>
    </>
  );
};

export default DeleteProjectButton;
