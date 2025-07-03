import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Toast from "../Toast";
import AccessToken from "../auth/AccessToken";
import LoadingOverlay from "../LoadingOverlay";
import SmallSpinner from "../SmallSpinner";
import { FaArrowLeft, FaFolderPlus } from "react-icons/fa";
import "../Styles/CreateProject.css";
import { fetchTeamDetails } from "../teams/fetchTeamDetails";

const CreateProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const org = useSelector((state) => state.organization);
  const organizationId = org.id;
  const userData = useSelector((state) => state.user);
  const teams = useSelector((state) => state.organization.teams);

  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [TeamId, setTeamId] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "PLANNING",
    startDate: "",
    endDate: "",
    priority: "MEDIUM",
    budget: 0,
    members: [],
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      members: selectedUsers.map((u) => ({
        userId: u.id,
        role: u.role,
      })),
    }));
  }, [selectedUsers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "budget" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleUserCheck = (userId, checked) => {
    setSelectedUsers((prev) => {
      if (checked) {
        const exists = prev.find((u) => u.id === userId);
        if (!exists) return [...prev, { id: userId, role: "MEMBER" }];
      } else {
        return prev.filter((u) => u.id !== userId);
      }
      return prev;
    });
  };

  const handleUserRoleChange = (userId, role) => {
    setSelectedUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
  };

  const handleTeamSelect = (e) => {
    setTeamId(e.target.value);
  };

  useEffect(() => {
    const getTeam = async () => {
      if (!TeamId) return;
      await fetchTeamDetails({
        userData,
        teamId: TeamId,
        setToast,
        setIsLoading,
        navigate,
        dispatch,
        onSuccess: (teamData) => {
          const members = teamData.data.members.map((m) => m.user);
          setTeamMembers(members);
        },
      });
    };

    getTeam();
  }, [TeamId, dispatch, navigate, userData]);

  const handleSubmit = async (retried = false) => {
    if (!TeamId) {
      setToast({ message: "Please select a team", type: "error" });
      return;
    }

    setIsLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    const payload = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/organization/${organizationId}/team/${TeamId}/project`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        console.log(payload);
        setToast({ message: data.message, type: "success" });
        setTimeout(() => navigate("/Home"), 1500);
      } else if (data.message === "Token expired" && !retried) {
        const newToken = await AccessToken({
          userData,
          dispatch,
          navigate,
          setToast,
        });
        if (newToken) {
          userData.accessToken = newToken;
          localStorage.setItem("accessToken", newToken);
          await handleSubmit(true);
        } else {
          setToast({
            message: "Session expired. Please login again",
            type: "error",
          });
        }
      } else {
        setToast({
          message: data.message || "Failed to create project",
          type: "error",
        });
      }
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="createproject-container">
        <header
          className="createproject-header"
          onClick={() => navigate("/Home")}
        >
          <FaArrowLeft className="createproject-back-icon" />
          <h6>Back</h6>
        </header>
        <h2>
          <FaFolderPlus className="createproject-project-icon" /> Create Project
        </h2>
        <form
          className="createproject-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <label>
            Select Team:
            <select value={TeamId} onChange={handleTeamSelect} required>
              <option value="">-- Select Team --</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Project Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              required
              onChange={handleChange}
            />
          </label>

          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </label>

          <label>
            Status:
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="PLANNING">PLANNING</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </label>

          <label>
            Start Date:
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </label>

          <label>
            End Date:
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </label>

          <label>
            Priority:
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </label>

          <label>
            Budget:
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
            />
          </label>

          {TeamId && (
            <>
              <button
                type="button"
                onClick={() => setShowMembers((prev) => !prev)}
                className="createproject-toggle-members-button"
              >
                {showMembers ? "Hide Members" : "Show Members"}
              </button>

              {showMembers && (
                <div className="createproject-add-project-members">
                  <h4>Add Project Members</h4>
                  {teamMembers.map((user) => {
                    if (user.id === userData.id) return null;
                    const isSelected = selectedUsers.some(
                      (u) => u.id === user.id
                    );
                    const role =
                      selectedUsers.find((u) => u.id === user.id)?.role ||
                      "MEMBER";
                    return (
                      <div
                        key={user.id}
                        className="createproject-selected-user"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) =>
                            handleUserCheck(user.id, e.target.checked)
                          }
                        />
                        <span>
                          {user.firstName} {user.lastName}
                        </span>
                        <select
                          value={role}
                          onChange={(e) =>
                            handleUserRoleChange(user.id, e.target.value)
                          }
                          disabled={!isSelected}
                          className="role-select"
                        >
                          <option value="MEMBER">MEMBER</option>
                          <option value="LEADER">LEADER</option>
                        </select>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          <br />
          <button type="submit" disabled={isLoading}>
            {isLoading ? <SmallSpinner /> : "Create Project"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateProject;
