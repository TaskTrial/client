/* eslint-disable react/prop-types */
import { MdRestore } from "react-icons/md";
import ConfirmModal from "../ConfirmModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccessToken from "../auth/AccessToken";
import { useSelector, useDispatch } from "react-redux";

const RestoreUserButton = ({ setToast, setIsLoading }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetUserId, setTargetUserId] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const userId = targetUserId.trim();
  const handleRestoreUser = async (retried = false) => {
    if (!userId) {
      setToast({ message: "Please enter a user ID.", type: "error" });
      return;
    }
    const accessToken = localStorage.getItem("accessToken");
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${userId}/restore`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setToast({ message: data.message, type: "success" });
        setShowConfirm(false);
        setTargetUserId("");
      } else if (data.message === "Token expired" && !retried) {
        const newAccessToken = await AccessToken({
          userData,
          dispatch,
          navigate,
          setToast,
        });

        if (newAccessToken) {
          userData.accessToken = newAccessToken;
          await handleRestoreUser(true);
        } else {
          setToast({ message: "Could not refresh session.", type: "error" });
        }
      } else {
        setToast({ message: data.message || "Restore failed", type: "error" });
      }
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // if (userData.role !== "admin") return null;

  return (
    <>
      {showConfirm && (
        <ConfirmModal
          message={
            <>
              <p>Are you sure you want to restore this user?</p>
              <input
                type="text"
                placeholder="Enter User ID"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                className="confirm-input"
              />
            </>
          }
          onConfirm={handleRestoreUser}
          onCancel={() => {
            setShowConfirm(false);
            setTargetUserId("");
          }}
        />
      )}

      <div
        style={{ backgroundColor: "#28a745" }}
        className="profile-action restoreaction"
        onClick={() => setShowConfirm(true)}
      >
        <button
          style={{ backgroundColor: "#28a745", color: "#fff" }}
          className="profile-button"
        >
          <MdRestore size={18} />
          Restore User
        </button>
      </div>
    </>
  );
};

export default RestoreUserButton;
