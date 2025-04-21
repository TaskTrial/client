import {
  FaArrowLeft,
  FaBuilding,
  FaSignOutAlt,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "../../Styles/Profile.css";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../../store/userSlice";
import ConfirmModal from "../../ConfirmModal";
import { useState } from "react";
import Toast from "../../Toast";
import DeleteAccountButton from "./DeleteAccountButton";
import LoadingOverlay from "../../LoadingOverlay";
import ResetPasswordButton from "./ResetPasswordButton";
import RestoreUserButton from "./RestoreUserButton";
const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const [toast, setToast] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleEditProfile = () => {
    navigate("/Home/EditProfile");
  };
  const handleLogout = () => {
    setShowConfirm(true);
  };
  const confirmLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate("/SignIn");
  };

  const backToDashboard = () => {
    navigate("/Home");
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to log out?"
          onConfirm={confirmLogout}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <div className="profile-container">
        <header className="profile-header" onClick={backToDashboard}>
          <FaArrowLeft className="profile-back-icon" />
          <h6 className="profile-title">Dashboard</h6>
        </header>
        <h1 className="profile-top">Profile</h1>
        <div className="profile-card">
          <div className="profile-avatar">
            {/* صورة بروفايل افتراضية من React Icons */}
            <FaUserCircle size={80} />
            {/* <FaCheckCircle size={80} /> */}
          </div>
          <h3 className="profile-name">{`${userData.firstName} ${userData.lastName}`}</h3>
          <p className="profile-job">{userData.jobTitle}</p>

          <div className="profile-info">
            <p>
              <strong>username</strong>
              {userData.username}
            </p>
            <p>
              <strong>full name</strong>
              {`${userData.firstName} ${userData.lastName}`}
            </p>
            <p>
              <strong>role</strong>
              {userData.role}
            </p>
            <p>
              <strong>Email</strong>
              {userData.email}
            </p>
            <p>
              <strong>Phone</strong>
              {userData.phoneNumber}
            </p>
            <p>
              <strong>Bio</strong>
              {userData.bio}
            </p>
            <p>
              <strong>Join At</strong>
              {userData.createdAt}
            </p>
          </div>
        </div>

        <div className="profile-actions">
          <div className="profile-action" onClick={handleEditProfile}>
            <button className="profile-button">
              <MdEdit size={18} />
              Edit Profile
            </button>
            <FaArrowRight className="profile-back-icon" />
          </div>
          <div className="profile-action">
            <button className="profile-button">
              <FaBuilding size={18} />
              My Organization
            </button>
            <FaArrowRight className="profile-back-icon" />
          </div>
          <div className="profile-action">
            <button className="profile-button">
              <FaCheckCircle size={18} />
              Terms of Service
            </button>
            <FaArrowRight className="profile-back-icon" />
          </div>
          <div className="profile-action" onClick={handleLogout}>
            <button className="profile-button">
              <FaSignOutAlt size={18} />
              Logout
            </button>
            <FaArrowRight className="profile-back-icon" />
          </div>
          {/* /////////////////////////////////////////////////// */}
          <DeleteAccountButton
            setToast={setToast}
            setIsLoading={setIsLoading}
          />

          <ResetPasswordButton
            setToast={setToast}
            setIsLoading={setIsLoading}
          />
          <RestoreUserButton setToast={setToast} setIsLoading={setIsLoading} />
        </div>
      </div>
    </>
  );
};

export default Profile;
