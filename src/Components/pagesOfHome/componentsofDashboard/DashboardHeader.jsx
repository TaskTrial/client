import { useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
const DashboardHeader = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const profilePic = userData.profilePic;
  const goToProfile = () => {
    navigate("/Home/Profile");
  };

  return (
    <div className="dashboard-header">
      <h2>Dashboard</h2>
      <div className="dashboard-header-right">
        <FiBell className="dashboard-icon" />
        {profilePic ? (
          <img
            src={profilePic}
            alt="Profile"
            className="dashboard-profile-iconBack"
            onClick={goToProfile}
          />
        ) : (
          <FaUserCircle
            size={80}
            className="dashboard-profile-icon"
            onClick={goToProfile}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
