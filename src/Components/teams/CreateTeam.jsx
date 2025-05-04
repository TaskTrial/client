import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { setTeam } from "../store/teamSlice";
import Toast from "../Toast";
import AccessToken from "../auth/AccessToken";
import LoadingOverlay from "../LoadingOverlay";
import SmallSpinner from "../SmallSpinner";
import { FaArrowLeft, FaUsers } from "react-icons/fa";
import "../Styles/CreateTeam.css";

const CreateTeam = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const org = useSelector((state) => state.organization);
  const organizationId = org.id;
  const userData = useSelector((state) => state.user);
  const users = useSelector((state) => state.organization.users);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    members: [],
  });
  const handleUserCheck = (userId, checked) => {
    setSelectedUsers((prev) => {
      if (checked) {
        const already = prev.find((u) => u.id === userId);
        if (!already) return [...prev, { id: userId, role: "MEMBER" }];
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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (retried = false) => {
    setIsLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    const beforepayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      members: formData.members,
    };
    const payload = Object.fromEntries(
      Object.entries(beforepayload).filter(([, value]) => value !== "" || [])
    );
    console.log("Payload being sent:", payload);

    try {
      const response = await fetch(
        `http://localhost:3000/api/organization/${organizationId}/team`,
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
        // dispatch(setTeam(data.data));
        setToast({ message: data.message, type: "success" });
        setFormData({ name: "", description: "" });
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
          message: data.message || "Failed to create team",
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
      <div className="create-team-container">
        <form
          className="create-team-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <header
            className="create-team-header"
            onClick={() => navigate("/Home")}
          >
            <FaArrowLeft className="back-icon" />
            <h6>Back</h6>
          </header>
          <h2>
            <FaUsers className="team-icon" /> Create Team
          </h2>
          <label>
            Team Name:
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
          <button
            type="button"
            onClick={() => setShowMembers((prev) => !prev)}
            className="toggle-members-button"
          >
            {showMembers ? "Hide Members" : "Show Members"}
          </button>
          {showMembers && (
            <div className="add-team-members">
              <h4>Add team members</h4>
              {users.map((user) => {
                const isSelected = selectedUsers.some((u) => u.id === user.id);
                const role =
                  selectedUsers.find((u) => u.id === user.id)?.role || "MEMBER";
                if (user.id !== userData.id) {
                  return (
                    <div key={user.id} className="selected-user">
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
                } else {
                  return null;
                }
              })}
            </div>
          )}
          <br />
          <button type="submit" disabled={isLoading}>
            {isLoading ? <SmallSpinner /> : "Create Team"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateTeam;
