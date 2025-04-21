import { useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
const DashboardHeader = () => {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate("/Home/Profile");
  };

  return (
    <div className="dashboard-header">
      <h2>Dashboard</h2>
      <div className="dashboard-header-right">
        <FiBell className="dashboard-icon" />
        <FaUserCircle
          className="dashboard-profile-icon"
          onClick={goToProfile}
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
