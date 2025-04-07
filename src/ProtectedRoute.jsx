/* eslint-disable react/prop-types */
// import { Children } from "react";
import { Navigate } from "react-router-dom";
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("auth");

  return isAuthenticated ? children : <Navigate to="/SignIn" />;
}

export default ProtectedRoute;
