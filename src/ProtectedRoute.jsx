/* eslint-disable react/prop-types */
// import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
function ProtectedRoute({ children }) {
  const userData = useSelector((state) => state.user);
  const isAuthenticated = userData.isAuthenticated;
  // const executed = useRef(false);
  // const [shouldRedirect, setShouldRedirect] = useState(false);
  // useEffect(() => {
  //   if (!isAuthenticated && !executed.current) {
  //     executed.current = true;
  //     setTimeout(() => {
  //       alert("please login first because accessToken was expired");
  //       setShouldRedirect(true);
  //     }, 1500);
  //   }
  // }, [isAuthenticated]);

  // if (!isAuthenticated && shouldRedirect) {
  //   return <Navigate to="/SignIn" />;
  // }
  // return isAuthenticated ? children : null;

  return isAuthenticated ? children : <Navigate to="/SignIn" />;
}
export default ProtectedRoute;
