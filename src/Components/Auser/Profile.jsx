import {
  FaArrowLeft,
  FaUniversity,
  FaSignOutAlt,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "../Styles/Profile.css";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../store/userSlice";
import ConfirmModal from "../ConfirmModal";
import { useState } from "react";
import Toast from "../Toast";
import DeleteAccountButton from "./DeleteAccountButton";
import LoadingOverlay from "../LoadingOverlay";
import ResetPasswordButton from "./ResetPasswordButton";
import RestoreUserButton from "./RestoreUserButton";
import GetAllUsersButton from "./GetAllUsersButton";
import { format } from "date-fns";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const [toast, setToast] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const profilePic = userData.profilePic;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // const formattedDate = format(date, "yyyy-MM-dd HH:mm:ss");
    // const formattedDate = format(date, "MMM dd, yyyy");
    // const formattedDate = format(date, "yyyy MMMM dd HH:mm:ss");
    const formattedDate = format(date, "MMM dd, yyyy HH:mm:ss");
    const hours = date.getHours();
    const period = hours >= 12 ? "PM" : "AM";
    return `${formattedDate} ${period}`;
  };
  const formattedDateJonn = formatDate(userData.createdAt);
  const formattedDateUpdate = formatDate(userData.updatedAt);
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
  const goToOrg = () => {
    navigate("/Home/Organization");
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
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="editProfile-avatar"
              />
            ) : (
              <FaUserCircle size={80} className="editProfile-avatar-icon" />
            )}
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
              {userData.phoneNumber || "01157754478"}
            </p>
            <p>
              <strong>Bio</strong>
              {userData.bio || "front-end engineering"}
            </p>
            <p>
              <strong>Join At</strong>
              {formattedDateJonn}
            </p>
            <p>
              <strong>Updated At</strong>
              {formattedDateUpdate}
            </p>
            <p>
              <strong>My Organization</strong>
              {userData.organization?.id || "No organization"}
            </p>
            <p>
              <strong>Name Of My Organization</strong>
              {userData.organization?.name || "No organization name"}
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
          <div className="profile-action" onClick={goToOrg}>
            <button className="profile-button">
              <FaUniversity size={18} />
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
          <GetAllUsersButton setToast={setToast} setIsLoading={setIsLoading} />
        </div>
      </div>
    </>
  );
};

export default Profile;
