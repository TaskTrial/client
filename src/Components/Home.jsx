import "./Styles/Home.css";
///////icons////////
import { MdApps } from "react-icons/md";
import { MdWorkOutline } from "react-icons/md";
import { MdChatBubbleOutline } from "react-icons/md";
import { MdChecklist } from "react-icons/md";
import { MdMoreHoriz } from "react-icons/md";
///////////hooks////////=>:
import { useState } from "react";
//////////////router////////////
import { Link, Outlet, useLocation } from "react-router-dom";

function Home() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // const storedStatus = localStorage.getItem("isSidebarOpen") || "true";
  // const [isSidebarOpen, setIsSidebarOpen] = useState(storedStatus);
  // useEffect(() => {
  //   localStorage.setItem("isSidebarOpen", isSidebarOpen);
  // }, [isSidebarOpen]);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      <button
        className={`toggle-btn ${isSidebarOpen ? "btn-open" : "btn-closed"}`}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? "<" : ">"}
      </button>
      <div className={`Home ${isSidebarOpen ? "" : "toggle-home"}`}>
        <div className={`main-links ${isSidebarOpen ? "" : "sidebar-hidden"}`}>
          <h1>task trial</h1>
          <div className="create-project">
            <span>+</span>
            <span>create new project</span>
          </div>
          <ul>
            <li className={currentPath === "/Home" ? "active" : ""}>
              <Link to="/Home">
                <MdApps
                  size={24}
                  color={currentPath === "/Home" ? "orangered" : "white"}
                />
                <span>Dashboard</span>
              </Link>
            </li>
            <li
              // in this case we dependent on currentpath directly or use localstorage
              //because useState when refresh ,it retrun inital value
              className={currentPath === "/Home/Projects" ? "active" : ""}
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
            <li className={currentPath === "/Home/Tasks" ? "active" : ""}>
              <Link to="/Home/Tasks">
                <MdChatBubbleOutline
                  size={24}
                  color={currentPath === "/Home/Tasks" ? "orangered" : "white"}
                />
                <span>Tasks</span>
              </Link>
            </li>
            <li className={currentPath === "/Home/Chat" ? "active" : ""}>
              <Link to="/Home/Chat">
                <MdChecklist
                  size={24}
                  color={currentPath === "/Home/Chat" ? "orangered" : "white"}
                />
                <span>Chat</span>
              </Link>
            </li>
            <li className={currentPath === "/Home/Taskboard" ? "active" : ""}>
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
        <div className="content">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Home;
