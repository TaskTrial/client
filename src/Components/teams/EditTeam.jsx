import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import "../Styles/EditProfile.css";
import Toast from "../Toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AccessToken from "../auth/AccessToken";
import LoadingOverlay from "../LoadingOverlay";
///////
import { useSelector } from "react-redux";
import TeamImageUploader from "./TeamImageUploader";
import AddTeamMembers from "./AddTeamMembers";
const EditTeam = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const teamsData = useSelector((state) => state.team);
  const teamData = teamsData.team;
  const members = teamsData.members;
  console.log(members);
  const users = useSelector((state) => state.organization.users);
  const [formDataState, setFormDataState] = useState({
    name: "",
    description: "",
  });

  const handleInputChange = (e) => {
    setFormDataState({ ...formDataState, [e.target.name]: e.target.value });
  };
  const onSubmitHandler = (e) => {
    e.preventDefault();
    handleSubmit();
  };
  const teamId = teamData.id;
  const handleSubmit = async (retried = false) => {
    const orgId = await userData?.organization?.id;
    setIsLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    const beforepayload = {
      name: formDataState.name.trim(),
      description: formDataState.description.trim(),
    };
    const payload = Object.fromEntries(
      Object.entries(beforepayload).filter(([, value]) => value !== "")
    );

    try {
      const response = await fetch(
        `http://localhost:3000/api/organization/${orgId}/team/${teamId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setToast({
          message: data.message || "Data saved successfully",
          type: "success",
        });
      } else if (
        (data.message === "Token expired" ||
          response.message === "Unauthorized") &&
        !retried
      ) {
        const newAccessToken = await AccessToken({
          userData,
          dispatch,
          navigate,
          setToast,
        });
        if (newAccessToken) {
          userData.accessToken = newAccessToken;
          localStorage.setItem("accessToken", newAccessToken);
          await handleSubmit(true);
        } else {
          setToast({
            message: "Could not refresh session.",
            type: "error",
          });
        }
      } else {
        setToast({
          message: data.message || "An error occurred while saving.",
          type: "error",
        });
      }
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  const backToTeam = () => {
    navigate(`/Home/Teams/${teamId}`);
  };
  return (
    <div className="editProfile-container">
      <LoadingOverlay isLoading={isLoading} />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <header className="editProfile-header" onClick={backToTeam}>
        <FaArrowLeft className="editProfile-back-icon" />
        <h6 className="editProfile-title">Team</h6>
      </header>
      <h1 className="EditProfile-top">EditTeam</h1>
      <TeamImageUploader
        profilePicFromApi={teamData.avatar}
        setToast={setToast}
        setIsLoading={setIsLoading}
      />
      <form className="editProfile-form" onSubmit={onSubmitHandler}>
        <label>
          new Name of Team
          <input
            name="name"
            value={formDataState.name}
            onChange={handleInputChange}
            type="text"
            placeholder="Enter your new Name of team "
          />
        </label>
        <label>
          description of team
          <textarea
            name="description"
            value={formDataState.description}
            onChange={handleInputChange}
            placeholder="Enter your new description of team"
            maxLength="100"
          />
          <div className="editProfile-charcount">20/100</div>
        </label>

        <button type="submit" className="editProfile-save-button">
          Save Changes
        </button>
      </form>
      <AddTeamMembers
        users={users}
        teamId={teamId}
        setToast={setToast}
        setIsLoading={setIsLoading}
      />
    </div>
  );
};

export default EditTeam;
