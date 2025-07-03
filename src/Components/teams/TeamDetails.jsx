import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTeamDetails } from "./fetchTeamDetails";
import "../Styles/DepartmentDetails.css";
import { MdEdit } from "react-icons/md";
import { FaArrowRight, FaArrowLeft, FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { FaProjectDiagram } from "react-icons/fa";
import LoadingOverlay from "../LoadingOverlay";
import Toast from "../Toast";
import "../Styles/DepartmentDetails.css";
import DeleteTeamButton from "./DeleteTeamButton";
import DeleteMemberButton from "./DeleteMemberButton";
import { useParams } from "react-router-dom";
import RestoreProjectButton from "../projects/RestoreProjectButton";
// import DeleteDepartmentButton from "./DeleteDepartmentButton";
const TeamDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const org = useSelector((state) => state.organization);
  const team = useSelector((state) => state.team.team);
  const profilePic = team.avatar;
  const members = useSelector((state) => state.team.members);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id: teamId } = useParams();

  useEffect(() => {
    const getTeam = async () => {
      await fetchTeamDetails({
        userData,
        teamId,
        setToast,
        setIsLoading,
        navigate,
        dispatch,
      });
    };
    getTeam();
  }, [teamId, dispatch, navigate, userData]);
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
          onClick={() => {
            navigate(`/Home/Teams`);
          }}
        >
          <FaArrowLeft className="profile-back-icon" />
          <h6 className="profile-title">Teams</h6>
        </header>
        <div style={{ width: "100px", marginInline: "auto" }}>
          {profilePic ? (
            <img
              src={profilePic}
              alt="Profile"
              className="editProfile-avatar"
            />
          ) : (
            <FaUserCircle size={100} className="editProfile-avatar-icon" />
          )}
        </div>
        {isLoading ? (
          <p className="loading-text">Loading...</p>
        ) : team.id ? (
          <>
            <h3>Creator</h3>

            <div key={team.creator.id} className="owner-card">
              {team.creator.profilePic ? (
                <img
                  src={team.creator.profilePic}
                  alt="member"
                  className="owner-image"
                />
              ) : (
                <FaUserCircle size={50} className="editProfile-avatar-icon" />
              )}
              <div className="owner-info">
                <h3 className="owner-name">{`${team.creator.firstName} ${team.creator.lastName}`}</h3>
                <p className="owner-email">{team.creator.email}</p>
              </div>
            </div>
            <h3>Members</h3>
            <div className="owners-container">
              {members.map((member) => {
                // .filter((member) => member.user.id !== team.creator.id)
                // member.user.id !== team.creator.id &&
                if (member.user.id == team.creator.id) return null;
                return (
                  <div key={member.id} className="owner-card">
                    {member.user.profilePic ? (
                      <img
                        src={member.user.profilePic}
                        alt="member"
                        className="owner-image"
                      />
                    ) : (
                      <FaUserCircle
                        size={50}
                        className="editProfile-avatar-icon"
                      />
                    )}
                    <div className="owner-info">
                      <h3 className="owner-name">{`${member.user.firstName} ${member.user.lastName}`}</h3>
                      <p className="owner-email">{member.user.email}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="department-box">
              <h4 className="dept-title">{team.name}</h4>
              <p>{team.description}</p>
              <p>org name:{org.name}</p>
              <p>org id:{org.id}</p>
              <p>team id:{team.id}</p>
              <p>{team.createdAt}</p>
              <p>{team.updatedAt}</p>
            </div>
            <div className="profile-actions">
              <div
                className="profile-action"
                onClick={() => {
                  navigate(`/Home/TeamProjects`, {
                    state: { teamId: teamId },
                  });
                }}
              >
                <button className="profile-button">
                  <FaProjectDiagram size={18} color="#ff8c42" />
                  projects of this team
                </button>
                <FaArrowRight className="profile-back-icon" />
              </div>
              <div
                className="profile-action"
                onClick={() => navigate(`/Home/Teams/${teamId}/EditTeam`)}
              >
                <button className="profile-button">
                  <MdEdit size={18} />
                  Edit Team
                </button>
                <FaArrowRight className="profile-back-icon" />
              </div>
              <RestoreProjectButton
                setToast={setToast}
                setIsLoading={setIsLoading}
              />

              <DeleteTeamButton
                setToast={setToast}
                setIsLoading={setIsLoading}
              />
              <DeleteMemberButton
                setToast={setToast}
                setIsLoading={setIsLoading}
              />
            </div>
          </>
        ) : (
          <p className="error-text">No Team data found</p>
        )}
      </div>
    </>
  );
};

export default TeamDetails;
