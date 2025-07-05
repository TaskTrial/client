import { useEffect, useState } from "react";
import { fetchTeams } from "./fetchTeams";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../Styles/Departments.css";
import { useSelector } from "react-redux";
import LoadingOverlay from "../LoadingOverlay";
import Toast from "../Toast";
import "../Styles/Departments.css";
import { FaArrowLeft } from "react-icons/fa";

const Teams = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const team = useSelector((state) => state.team);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getTeams = async () => {
      await fetchTeams({
        userData,
        setToast,
        setIsLoading,
        dispatch,
        navigate,
      });
    };

    getTeams();
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
        <h2 className="departments-title">Teams</h2>

        {isLoading ? (
          <p className="loading-text">Loading...</p>
        ) : (
          <>
            <div className="departments-grid">
              {team.teams.map((team) => (
                <div
                  key={team.id}
                  className="department-card"
                  onClick={() => navigate(`/Home/Teams/${team.id}`)}
                >
                  <h3 className="department-name">{team.name}</h3>
                  <p className="department-description">{team.description}</p>
                  <p className="department-description">
                    {new Date(team.createdAt).toDateString()}
                  </p>
                  <p className="department-description">
                    {new Date(team.updatedAt).toDateString()}
                  </p>
                </div>
              ))}
            </div>
            {/* <RestoreDepartmentButton
              setToast={setToast}
              setIsLoading={setIsLoading}
            /> */}
          </>
        )}
      </div>
    </>
  );
};

export default Teams;
