/* eslint-disable react/prop-types */
import "./Styles/CreateMenuModal.css";
import { Link, useLocation } from "react-router-dom";
import { FaSitemap } from "react-icons/fa"; // FontAwesome

const CreateMenuModal = ({ onClose }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="createmenumodal-overlay">
      <div className="createmenucreate-menu-modal">
        <button className="createmenuclose-button" onClick={onClose}>
          &times;
        </button>
        <h3 style={{ color: "#444" }}>Select an action:</h3>
        <div className="createmenumodal-links">
          <ul>
            <li
              onClick={onClose}
              className={` ${
                currentPath === "/Home/CreateDepartment" ? "Homeactive" : ""
              }`}
            >
              <Link to="/Home/CreateDepartment" state={{ from: "/Home" }}>
                <FaSitemap
                  size={24}
                  color={
                    currentPath === "/Home/CreateDepartment"
                      ? "orangered"
                      : "white"
                  }
                />
                <span>Create a Department</span>
              </Link>
            </li>
            <li onClick={onClose}>
              <Link to="/Home/CreateTeam">
                <FaSitemap size={24} color="white" />
                <span>Create a Team</span>
              </Link>
            </li>
            <li onClick={onClose}>
              <Link to="/Home/CreateProject">
                <FaSitemap size={24} color="white" />
                <span>Create a project</span>
              </Link>
            </li>
            <li onClick={onClose}>
              <Link to="/Home/CreateTask">
                <FaSitemap size={24} color="white" />
                <span>Create a Task</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateMenuModal;
