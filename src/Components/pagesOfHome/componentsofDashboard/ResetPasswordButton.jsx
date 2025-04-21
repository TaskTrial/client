/* eslint-disable react/prop-types */
import { useState } from "react";
import { MdEdit } from "react-icons/md";
import ConfirmModal from "../../ConfirmModal";
import { useSelector } from "react-redux";
import AccessToken from "../../auth/AccessToken";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPasswordButton = ({ setToast, setIsLoading }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleResetPassword = async (retried = false) => {
    setIsLoading(true);
    const payload = {
      oldPassword: oldPassword.toLowerCase().trim(),
      newPassword: newPassword.toLowerCase().trim(),
    };
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/update-password/${user.userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setToast({ message: data.message, type: "success" });
        setShowConfirm(false);
        setOldPassword("");
        setNewPassword("");
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
          await handleResetPassword(true);
        }
      } else {
        setToast({ message: data.message || "Reset failed", type: "error" });
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
            <div>
              <h3>Reset your Password</h3>
              <p>Enter your old and new password:</p>

              <div
                style={{ display: "block" }}
                className="Signpassword-wrapper"
              >
                <input
                  style={{
                    padding: "20px",
                    marginBlock: "10px",
                    borderRadius: "10px",
                  }}
                  type={showPassword ? "text" : "password"}
                  name="oldPassword"
                  id="oldPassword"
                  placeholder="Please Enter old password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <span
                  style={{ right: "75px", top: "28px" }}
                  className="Signicon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              <div
                style={{ display: "block" }}
                className="Signpassword-wrapper"
              >
                <input
                  style={{
                    padding: "20px",
                    borderRadius: "10px",
                  }}
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  id="newPassword"
                  placeholder="Please Enter new password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span
                  style={{ right: "75px", top: "20px" }}
                  className="Signicon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
          }
          onConfirm={handleResetPassword}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <div className="profile-action" onClick={() => setShowConfirm(true)}>
        <button className="profile-button">
          <MdEdit size={18} />
          Reset Password
        </button>
      </div>
    </>
  );
};

export default ResetPasswordButton;
