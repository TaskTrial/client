import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDepartmentDetails } from "./fetchDepartmentDetails";
import "../styles/DepartmentDetails.css";
import { MdEdit } from "react-icons/md";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import LoadingOverlay from "../LoadingOverlay";
import Toast from "../Toast";
import "../Styles/DepartmentDetails.css";
import DeleteDepartmentButton from "./DeleteDepartmentButton";
const DepartmentDetails = () => {
  const { id: departmentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const deptData = useSelector((state) => state.department);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getDepartment = async () => {
      await fetchDepartmentDetails({
        userData,
        departmentId,
        setToast,
        setIsLoading,
        navigate,
        dispatch,
      });
    };

    getDepartment();
  }, [departmentId, dispatch, navigate, userData]);

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
      <div className="department-details-container">
        <header
          className="profile-header"
          onClick={() => navigate(`/Home/Departments`)}
        >
          <FaArrowLeft className="profile-back-icon" />
          <h6 className="profile-title">Departments</h6>
        </header>
        {isLoading ? (
          <p className="loading-text">Loading...</p>
        ) : deptData.id ? (
          <>
            <div className="department-box">
              <h4 className="dept-title">{deptData.name}</h4>
              <p>{deptData.description}</p>
              <p>org name:{deptData.organization.name}</p>
              <p>org id:{deptData.organization.id}</p>
              <p>dept id:{deptData.id}</p>
              <p>{deptData.createdAt}</p>
              <p>{deptData.updatedAt}</p>
              <h3>Manager:</h3>
              <p>
                {deptData.manager?.firstName} {deptData.manager?.lastName} -{" "}
                {deptData.manager?.jobTitle} ({deptData.manager?.email})
              </p>
              <h3>Users:</h3>
              <ul>
                {deptData.users?.map((user) => (
                  <li key={user.id}>
                    {user.name} - {user.email}
                  </li>
                ))}
              </ul>
              <h3>Teams:</h3>
              <ul>
                {deptData.teams?.map((team) => (
                  <li key={team.id}>
                    {team.name} - {team.description}
                  </li>
                ))}
              </ul>
            </div>
            <div className="profile-actions">
              <div
                className="profile-action"
                onClick={() =>
                  navigate(`/Home/Departments/${deptData.id}/EditDepartment`)
                }
              >
                <button className="profile-button">
                  <MdEdit size={18} />
                  Edit Department
                </button>
                <FaArrowRight className="profile-back-icon" />
              </div>
              <DeleteDepartmentButton
                setToast={setToast}
                setIsLoading={setIsLoading}
              />
            </div>
          </>
        ) : (
          <p className="error-text">No department data found</p>
        )}
      </div>
    </>
  );
};

export default DepartmentDetails;
