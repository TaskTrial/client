import { Routes, Route } from "react-router-dom";
import "./App.css";
import SignUp from "./Components/auth/SignUp";
import SignIn from "./Components/auth/SignIn";
import NotFound from "./Components/NotFound";
import Home from "./Components/Home";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./Components/pagesOfHome/Dashboard";
import Projects from "./Components/pagesOfHome/Projects";
import Tasks from "./Components/pagesOfHome/Tasks";
import Chat from "./Components/pagesOfHome/Chat";
import More from "./Components/pagesOfHome/More";
import VerifyEmail from "./Components/auth/VerifyEmail";
import ForgotPassword from "./Components/auth/ForgetPassword";
import ResetPassword from "./Components/auth/ResetPassword";
import Profile from "./Components/Auser/Profile";
import EditProfile from "./Components/Auser/EditProfile";
import CreateOrganization from "./Components/organization/CreateOrganization";
import Organization from "./Components/organization/Organization";
import EditOrganization from "./Components/organization/EditOrganization";
import DepartmentsList from "./Components/departments/Departments";
import CreateDepartment from "./Components/departments/CreateDepartment";
import DepartmentDetails from "./Components/departments/DepartmentDetails";
import EditDepartment from "./Components/departments/EditDepartment";
import CreateTeam from "./Components/teams/CreateTeam";
import Teams from "./Components/teams/Teams";
import TeamDetails from "./Components/teams/TeamDetails";
import EditTeam from "./Components/teams/EditTeam";
/////////////////////////////////////////
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/VerifyEmail" element={<VerifyEmail />} />
        <Route path="/ForgetPassword" element={<ForgotPassword />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
        {/* Home route with nested routes inside it */}
        <Route
          path="/Home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="Profile" element={<Profile />} />
          <Route path="EditProfile" element={<EditProfile />} />
          <Route path="Projects" element={<Projects />} />
          <Route path="Tasks" element={<Tasks />} />
          <Route path="Chat" element={<Chat />} />
          <Route path="CreateOrganization" element={<CreateOrganization />} />
          <Route path="Organization" element={<Organization />} />
          <Route path="EditOrganization" element={<EditOrganization />} />
          <Route path="Departments" element={<DepartmentsList />} />
          <Route path="CreateDepartment" element={<CreateDepartment />} />
          <Route path="Departments/:id" element={<DepartmentDetails />} />
          <Route
            path="Departments/:id/EditDepartment"
            element={<EditDepartment />}
          />
          <Route path="CreateTeam" element={<CreateTeam />} />
          <Route path="Teams" element={<Teams />} />
          <Route path="Teams/:id" element={<TeamDetails />} />
          <Route path="Teams/:id/EditTeam" element={<EditTeam />} />
          <Route path="More" element={<More />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
