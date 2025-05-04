/* eslint-disable react/prop-types */
import { FaTrash } from "react-icons/fa";
import ConfirmModal from "../ConfirmModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccessToken from "../auth/AccessToken";
import { useSelector, useDispatch } from "react-redux";

const DeleteDepartmentButton = ({ setToast, setIsLoading }) => {
  // const { departmentId } = useParams();
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const deptData = useSelector((state) => state.department);
  const orgId = deptData.organizationId;
  const deptId = deptData.id;
  const handleDeleteDepartment = async (retried = false) => {
    setIsLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `http://localhost:3000/api/organizations/${orgId}/departments/${deptId}/delete`,
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
          message: data.message || "Department deleted",
          type: "success",
        });
        setTimeout(() => {
          navigate("/Home/Departments");
        }, 1500);
      } else if (data.message === "Token expired" && !retried) {
        const newAccessToken = await AccessToken({
          userData,
          dispatch,
          navigate,
          setToast,
        });
        if (newAccessToken) {
          userData.accessToken = newAccessToken;
          localStorage.setItem("accessToken", newAccessToken);
          await handleDeleteDepartment(true);
        } else {
          setToast({
            message: "Could not refresh session.",
            type: "error",
          });
        }
      } else {
        setToast({ message: data.message || "Delete failed", type: "error" });
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
          message="Are you sure you want to delete this department?"
          onConfirm={handleDeleteDepartment}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <div
        className="profile-action deleteaction"
        onClick={() => setShowConfirm(true)}
      >
        <button
          className="profile-button"
          style={{ backgroundColor: "#dc3545" }}
        >
          <FaTrash size={18} />
          Delete Department
        </button>
      </div>
    </>
  );
};

export default DeleteDepartmentButton;
