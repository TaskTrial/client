import "./Styles/Home.css";
///////icons////////
import { MdApps } from "react-icons/md";
import { MdWorkOutline } from "react-icons/md";
import { MdChatBubbleOutline } from "react-icons/md";
import { MdChecklist } from "react-icons/md";
import { MdMoreHoriz } from "react-icons/md";
///////////hooks////////=>:
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getUser } from "./store/userSlice";
import LoadingOverlay from "./LoadingOverlay";
import AccessToken from "./auth/AccessToken";
// import LoadingOverlay from "./LoadingOverlay";  loader
// const [isLoading, setIsLoading] = useState(false);
{
  /* <LoadingOverlay isLoading={isLoading} /> */
}
import Toast from "./Toast";
// import Toast from "./Toast"; toaster
// const [toast, setToast] = useState(null);
// {toast && (
//           <Toast
//             message={toast.message}
//             type={toast.type}
//             onClose={() => setToast(null)}
//           />
//         )}
//////////////router////////////
import { useNavigate } from "react-router-dom";
import { Link, Outlet, useLocation } from "react-router-dom";

function Home() {
  const userData = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const currentPath = location.pathname;
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // const storedStatus = localStorage.getItem("isSidebarOpen") || "true";
  // const [isSidebarOpen, setIsSidebarOpen] = useState(storedStatus);
  // useEffect(() => {
  //   localStorage.setItem("isSidebarOpen", isSidebarOpen);
  // }, [isSidebarOpen]);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const fetchUser = async (retried = false) => {
    if (!userData?.id || !userData?.accessToken) {
      setToast({
        message: "User not found",
        type: "error",
      });
      setTimeout(() => {
        navigate("/SignIn");
      }, 1500);
      return;
    }
    setIsLoading(true);
    // if (!userId || !accessToken) {
    //   setToast({
    //     message: "user not found",
    //     type: "error",
    //   });
    //   setIsLoading(false);
    //   return;
    // }
    const userId = userData.id;
    const accessToken = userData.accessToken;
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      if (response.status == 200) {
        localStorage.setItem("getUser", JSON.stringify(data.user));
        dispatch(
          getUser({
            user: {
              ...data.user,
              id: userData.id,
              email: userData.email,
              role: userData.role,
            },
          })
        );
        setToast({
          message: data.message || "Data get successfully",
          type: "success",
        });
      } else if (data.message === "Token expired" && !retried) {
        const newAccessToken = await AccessToken({
          refreshToken: userData.refreshToken,
          userData,
          dispatch,
          navigate,
          setToast,
        });
        if (newAccessToken) {
          userData.accessToken = newAccessToken;
          await fetchUser(true);
        } else {
          setToast({
            message: "Could not refresh session.",
            type: "error",
          });
        }
      } else {
        setToast({ message: data.message, type: "error" });
        console.log("from Home ");
      }
    } catch (error) {
      // console.error('Error fetching user:', error);
      setToast({ message: error.message, type: "error" });
      console.log(`1-3-${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // const hasFetched = useRef(false);
  // useEffect(() => {
  //   if (!userId) {
  //     setToast({
  //       message: "user not found",
  //       type: "error",
  //     });
  //     setTimeout(() => {
  //       navigate("/SignIn");
  //     }, 1500);
  //   } else if (userId && accessToken && !hasFetched.current) {
  //     hasFetched.current = true;
  //     fetchUser();
  //   }
  // }, [userId, accessToken, navigate]);

  const hasFetched = useRef(false);
  useEffect(() => {
    console.log("userData", userData);
    if (!userData || !userData.id || !userData.accessToken) return;
    console.log("Fetching user...");
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchUser();
    }
  }, [userData]);

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
      <button
        className={`Hometoggle-btn ${
          isSidebarOpen ? "Homebtn-open" : "Homebtn-closed"
        }`}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? "<" : ">"}
      </button>
      <div className={`Home ${isSidebarOpen ? "" : "Hometoggle-home"}`}>
        <div
          className={`Homemain-links ${
            isSidebarOpen ? "" : "Homesidebar-hidden"
          }`}
        >
          <h1>task trial</h1>
          <div className="Homecreate-project">
            <span>+</span>
            <span>create new project</span>
          </div>
          <ul>
            <li
              className={
                currentPath === "/Home" || currentPath === "/Home/Dashboard"
                  ? "Homeactive"
                  : ""
              }
            >
              {/* (currentPath === "/Home") | "/Home/Dashboard" */}
              <Link to="/Home">
                <MdApps
                  size={24}
                  color={
                    currentPath === "/Home" || currentPath === "/Home/Dashboard"
                      ? "orangered"
                      : "white"
                  }
                />
                <span>Dashboard</span>
              </Link>
            </li>
            <li
              // in this case we dependent on currentpath directly or use localstorage
              //because useState when refresh ,it retrun inital value
              className={currentPath === "/Home/Projects" ? "Homeactive" : ""}
            >
              <Link to="/Home/Projects">
                <MdWorkOutline
                  size={24}
                  color={
                    currentPath === "/Home/Projects" ? "orangered" : "white"
                  }
                />
                <span>Projects</span>
              </Link>
            </li>
            <li className={currentPath === "/Home/Tasks" ? "Homeactive" : ""}>
              <Link to="/Home/Tasks">
                <MdChatBubbleOutline
                  size={24}
                  color={currentPath === "/Home/Tasks" ? "orangered" : "white"}
                />
                <span>Tasks</span>
              </Link>
            </li>
            <li className={currentPath === "/Home/Chat" ? "Homeactive" : ""}>
              <Link to="/Home/Chat">
                <MdChecklist
                  size={24}
                  color={currentPath === "/Home/Chat" ? "orangered" : "white"}
                />
                <span>Chat</span>
              </Link>
            </li>
            <li
              className={currentPath === "/Home/Taskboard" ? "Homeactive" : ""}
            >
              <Link to="/Home/Taskboard">
                <MdMoreHoriz
                  size={24}
                  color={
                    currentPath === "/Home/Taskboard" ? "orangered" : "white"
                  }
                />
                <span>Taskboard</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="Homecontent">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Home;
