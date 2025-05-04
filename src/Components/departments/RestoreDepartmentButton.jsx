/* eslint-disable react/prop-types */
import { MdRestore } from "react-icons/md";
import ConfirmModal from "../ConfirmModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccessToken from "../auth/AccessToken";
import { useSelector, useDispatch } from "react-redux";

const RestoreDepartmentButton = ({ setToast, setIsLoading }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetDeptId, setTargetDeptId] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const orgId = userData.organization?.id;
  const deptId = targetDeptId.trim();
  const handleRestoreDepartment = async (retried = false) => {
    if (!deptId) {
      setToast({ message: "Please enter a department ID.", type: "error" });
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/organizations/${orgId}/departments/${deptId}/restore`,
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
          message: data.message || "Department restored",
          type: "success",
        });
        setShowConfirm(false);
        setTargetDeptId("");
      } else if (data.message === "Token expired" && !retried) {
        const newAccessToken = await AccessToken({
          userData,
          dispatch,
          navigate,
          setToast,
        });

        if (newAccessToken) {
          userData.accessToken = newAccessToken;
          await handleRestoreDepartment(true);
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

  //   if (userData.role !== "admin") return null;

  return (
    <>
      {showConfirm && (
        <ConfirmModal
          message={
            <>
              <p>Are you sure you want to restore this department?</p>
              <input
                type="text"
                placeholder="Enter Department ID"
                value={targetDeptId}
                onChange={(e) => setTargetDeptId(e.target.value)}
                className="confirm-input"
              />
            </>
          }
          onConfirm={handleRestoreDepartment}
          onCancel={() => {
            setShowConfirm(false);
            setTargetDeptId("");
          }}
        />
      )}

      <div
        style={{ backgroundColor: "#28a745" }}
        className="profile-action restoreaction"
        onClick={() => setShowConfirm(true)}
      >
        <button
          className="profile-button"
          style={{ backgroundColor: "#28a745", width: "100%", color: "#fff" }}
        >
          <MdRestore size={18} />
          Restore Department
        </button>
      </div>
    </>
  );
};

export default RestoreDepartmentButton;
