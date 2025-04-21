import { useSelector } from "react-redux";
import "../Styles/Dashboard.css";
import DashboardHeader from "./componentsofDashboard/DashboardHeader";
import OverviewCards from "./componentsofDashboard/OverviewCards";
import DashboardTotalProjects from "./componentsofDashboard/DashboardTotalProjects";
import DashboardTodayTasks from "./componentsofDashboard/DashboardTodayTasks";
function Dashboard() {
  //userData include tokens-2,id,name,email,role
  const userData = useSelector((state) => state.user);
  return (
    <div className="Dashboard">
      <DashboardHeader />
      <OverviewCards />
      <div className="dashboard-container">
        <DashboardTotalProjects />
        <DashboardTodayTasks />
      </div>
      <p>{userData.accessToken}</p>
      <p>{userData.refreshToken}</p>
      <p>{userData.id}</p>
      <p>{userData.name}</p>
      <p>{userData.email}</p>
      <p>{userData.role}</p>
      <p>{userData.email}</p>
    </div>
  );
}

export default Dashboard;
