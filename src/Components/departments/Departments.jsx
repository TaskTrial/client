import { useEffect, useState } from "react";
import { fetchDepartments } from "./fetchDepartments";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/Departments.css";
import { useSelector } from "react-redux";
import LoadingOverlay from "../LoadingOverlay";
import Toast from "../Toast";
import "../Styles/Departments.css";
import RestoreDepartmentButton from "./RestoreDepartmentButton";
import { FaArrowLeft } from "react-icons/fa";

const Departments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const department = useSelector((state) => state.department);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getDepartments = async () => {
      await fetchDepartments({
        userData,
        setToast,
        setIsLoading,
        dispatch,
        navigate,
      });
    };

    getDepartments();
  }, [navigate, dispatch, userData]);

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
      <div className="departments-container">
        <header
          className="create-organization-header"
          onClick={() => {
            if (window.innerWidth > 768) {
              navigate("/Home");
            } else {
              navigate("/Home/More");
            }
          }}
        >
          <FaArrowLeft className="create-organization-back-icon" />
          <h6 className="create-organization-title">back</h6>
        </header>
        <h2 className="departments-title">Departments</h2>

        {isLoading ? (
          <p className="loading-text">Loading...</p>
        ) : (
          <>
            <div className="departments-grid">
              {department?.departments?.map((dept) => (
                <div
                  key={dept.id}
                  className="department-card"
                  onClick={() => navigate(`/Home/Departments/${dept.id}`)}
                >
                  <h3 className="department-name">{dept.name}</h3>
                  <p className="department-description">{dept.description}</p>
                  <p className="department-description">{dept.createdAt}</p>
                  <p className="department-description">{dept.updatedAt}</p>
                </div>
              ))}
            </div>
            <RestoreDepartmentButton
              setToast={setToast}
              setIsLoading={setIsLoading}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Departments;
