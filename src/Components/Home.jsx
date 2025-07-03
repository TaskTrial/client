import "./Styles/Home.css";
///////icons////////
import { MdApps } from "react-icons/md";
import { MdWorkOutline } from "react-icons/md";
import { MdChecklist } from "react-icons/md";
import { MdMoreHoriz } from "react-icons/md";
import { FaUniversity } from "react-icons/fa";
///////////hooks////////=>:
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import LoadingOverlay from "./LoadingOverlay";
import { fetchUser } from "./Auser/fetchUser";
import { fetchOrganization } from "./organization/fetchOrganization";
import { getOrganizationStatus } from "./organization/getOrganizationStatus";
////////////////
// import { MdCategory } from "react-icons/md"; // Material Design
import { FaSitemap } from "react-icons/fa"; // FontAwesome
// import { AiFillFolderOpen } from "react-icons/ai"; // Ant Design Icons
// import { HiViewGrid } from "react-icons/hi"; // Heroicons

// import LoadingOverlay from "./LoadingOverlay";  loader
// const [isLoading, setIsLoading] = useState(false);
{
  /* <LoadingOverlay isLoading={isLoading} /> */
}
import Toast from "./Toast";
import CreateMenuModal from "./CreateMenuModal";
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
  const [showModal, setShowModal] = useState(false);
  // const storedStatus = localStorage.getItem("isSidebarOpen") || "true";
  // const [isSidebarOpen, setIsSidebarOpen] = useState(storedStatus);
  // useEffect(() => {
  //   localStorage.setItem("isSidebarOpen", isSidebarOpen);
  // }, [isSidebarOpen]);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
    if (!userData || !userData.id || !userData.accessToken) return;

    if (!hasFetched.current) {
      hasFetched.current = true;

      const fetchData = async () => {
        try {
          await fetchUser({
            userData,
            dispatch,
            navigate,
            setToast,
            setIsLoading,
          });
          // await fetchUser();
          // const orgId = JSON.parse(localStorage.getItem("getUser"))?.organization?.id;
          const orgId = await getOrganizationStatus({
            userData,
            dispatch,
            navigate,
            setToast,
            setIsLoading,
          });
          if (userData && userData.accessToken) {
            console.log(orgId);
            if (orgId) {
              await fetchOrganization({
                userData,
                orgId,
                setToast,
                setIsLoading,
                dispatch,
                navigate,
              });
            }
            if (!orgId) {
              navigate("/Home/CreateOrganization");
              return;
            }
          }

          // await fetchThirdThing();
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [userData, dispatch, navigate]);

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
      {showModal && <CreateMenuModal onClose={() => setShowModal(false)} />}
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
          <div
            className="Homecreate-project"
            onClick={() => setShowModal(true)}
          >
            <span>+</span>
            <span className="plusspan">create new org,project,....</span>
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
                <MdChecklist
                  size={24}
                  color={currentPath === "/Home/Tasks" ? "orangered" : "white"}
                />
                <span>Tasks</span>
              </Link>
            </li>
            {/* <li className={currentPath === "/Home/Chat" ? "Homeactive" : ""}>
              <Link to="/Home/Chat">
                <MdChatBubbleOutline
                  size={24}
                  color={currentPath === "/Home/Chat" ? "orangered" : "white"}
                />
                <span>Chat</span>
              </Link>
            </li> */}
            <li
              className={`showMore ${
                currentPath === "/Home/More" ? "Homeactive" : ""
              }`}
            >
              <Link to="/Home/More">
                <MdMoreHoriz
                  size={24}
                  color={currentPath === "/Home/More" ? "orangered" : "white"}
                />
                <span>More</span>
              </Link>
            </li>
            {/* <li
              className={`hiddenforMore ${
                currentPath === "/Home/CreateOrganization" ? "Homeactive" : ""
              }`}
            >
              <Link to="/Home/CreateOrganization">
                <FaUniversity
                  size={24}
                  color={
                    currentPath === "/Home/CreateOrganization"
                      ? "orangered"
                      : "white"
                  }
                />
                <span>Create an Organization</span>
              </Link>
            </li> */}
            <li
              className={`hiddenforMore ${
                currentPath === "/Home/Organization" ? "Homeactive" : ""
              }`}
            >
              {/* navigate("/Home/ProfileDetails", { state: { from: "/Home" } }); */}
              <Link to="/Home/Organization" state={{ from: "/Home" }}>
                <FaUniversity
                  size={24}
                  color={
                    currentPath === "/Home/Organization" ? "orangered" : "white"
                  }
                />
                <span>My Organization</span>
              </Link>
            </li>
            <li
              className={`hiddenforMore ${
                currentPath === "/Home/Departments" ? "Homeactive" : ""
              }`}
            >
              <Link to="/Home/Departments" state={{ from: "/Home" }}>
                <FaSitemap
                  size={24}
                  color={
                    currentPath === "/Home/Departments" ? "orangered" : "white"
                  }
                />
                <span>My Departments</span>
              </Link>
            </li>
            <li
              className={`hiddenforMore ${
                currentPath === "/Home/Teams" ? "Homeactive" : ""
              }`}
            >
              <Link to="/Home/Teams" state={{ from: "/Home" }}>
                <FaSitemap
                  size={24}
                  color={currentPath === "/Home/Teams" ? "orangered" : "white"}
                />
                <span>My Teams</span>
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
