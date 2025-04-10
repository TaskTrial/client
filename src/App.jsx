import { Routes, Route } from "react-router-dom";
import "./App.css";
import SignUp from "./Components/SignUp";
import SignIn from "./Components/SignIn";
import NotFound from "./Components/NotFound";
import Home from "./Components/Home";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./Components/pagesOfHome/Dashboard";
import Projects from "./Components/pagesOfHome/Projects";
import Tasks from "./Components/pagesOfHome/Tasks";
import Chat from "./Components/pagesOfHome/Chat";
import Taskboard from "./Components/pagesOfHome/Taskboard";
import VerifyEmail from "./Components/verifyEmail";
import ForgotPassword from "./Components/ForgetPassword";
import ResetPassword from "./Components/ResetPassword";
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
          <Route path="Projects" element={<Projects />} />
          <Route path="Tasks" element={<Tasks />} />
          <Route path="Chat" element={<Chat />} />
          <Route path="Taskboard" element={<Taskboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
