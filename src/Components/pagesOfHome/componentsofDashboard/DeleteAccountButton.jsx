/* eslint-disable react/prop-types */
import { FaTrash } from "react-icons/fa";
import ConfirmModal from "../../ConfirmModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AccessToken from "../../auth/AccessToken";
import { useSelector } from "react-redux";
import { logout } from "../../store/userSlice";
const DeleteAccountButton = ({ setToast, setIsLoading }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const handleDeleteAccount = async (retried = false) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/delete/${user.userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setToast({ message: data.message, type: "success" });

        // تسجيل الخروج
        localStorage.clear();
        dispatch(logout());
        navigate("/login");
      } else if (data.message === "Token expired" && !retried) {
        const newAccessToken = await AccessToken({
          refreshToken: user.refreshToken,
          user,
          dispatch,
          navigate,
          setToast,
        });
        if (newAccessToken) {
          user.accessToken = newAccessToken;
          await handleDeleteAccount(true);
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
          message="Are you sure you want to delete account?"
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <div
        className="profile-action deleteaction"
        onClick={() => setShowConfirm(true)}
      >
        <button className="profile-button">
          <FaTrash size={18} />
          Delete your account
        </button>
      </div>
    </>
  );
};

export default DeleteAccountButton;
