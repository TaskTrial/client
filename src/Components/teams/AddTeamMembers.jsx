/* eslint-disable react/prop-types */
import { useState } from "react";
import { useSelector } from "react-redux";
import "../Styles/AddTeamMembers.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AccessToken from "../auth/AccessToken";

const AddTeamMembers = ({ setToast, setIsLoading }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const team = useSelector((state) => state.team);
  const members = team.members;
  const teamId = team.team.id;
  const users = useSelector((state) => state.organization.users);
  const orgId = useSelector((state) => state.organization.id);
  const creator = team.team.creator;
  if (!creator) return <div>Loading...</div>;
  const handleUserSelect = (userId, role) => {
    // userId = String(userId);

    setSelectedUsers((prev) => {
      const existing = prev.find((u) => u.userId === userId);
      if (existing) {
        return prev.map((u) => (u.userId === userId ? { ...u, role } : u));
      } else {
        return [...prev, { userId: userId, role: role }];
      }
    });
  };

  const handleUserCheck = (userId, checked) => {
    if (!checked) {
      setSelectedUsers((prev) => prev.filter((u) => u.userId !== userId));
    }
  };

  const handleAddMembers = async (retried = false) => {
    if (!teamId || !orgId) {
      setToast({
        message: "TeamId and organizationId must be provided.",
        type: "error",
      });
      return;
    }

    if (selectedUsers.length === 0) {
      setToast({ message: "Choose members to add", type: "error" });
      return;
    }
    console.log("Sending users:", selectedUsers);

    setIsLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await fetch(
        `http://localhost:3000/api/organization/${orgId}/team/${teamId}/addMember`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ members: selectedUsers }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setToast({
          message: data.message || "Members added successfully",
          type: "success",
        });
        setSelectedUsers([]);
        setTimeout(() => {
          navigate(`/Home/Teams/${teamId}`);
        }, 1500);
      } else if (data.message === "Token expired" && !retried) {
        const newAccessToken = await AccessToken({
          userData,
          dispatch,
          navigate,
          setToast,
        });
        if (newAccessToken) {
          userData.accessToken = newAccessToken;
          localStorage.setItem("accessToken", newAccessToken);
          await handleAddMembers(true);
        } else {
          setToast({
            message: "Could not refresh session.",
            type: "error",
          });
        }
      } else {
        setToast({
          message: data.message || "Failed to add members",
          type: "error",
        });
        console.log("from else");
      }
    } catch (err) {
      setToast({ message: err.message, type: "error" });
      console.log("from catch");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-team-members">
      <h4>Add team members</h4>
      <select
        onChange={(e) => {
          // const [userId] = e.target.value.split("-");
          const userId = e.target.value;
          const already = selectedUsers.find((u) => u.userId === userId);
          if (!already) handleUserSelect(userId, "MEMBER");
        }}
        value=""
        className="select-user"
      >
        <option value="">-- Select a user --</option>
        {users
          .filter(
            (user) => !members.some((member) => member.user.id === user.id)
          )
          .filter((user) => user.id !== creator.id)
          .map((user) => (
            <option key={user.id} value={`${user.id}`}>
              {user.firstName} {user.lastName} - {user.email}
            </option>
          ))}
      </select>

      <div className="selected-users">
        {selectedUsers.map((u) => (
          <div key={u.userId} className="selected-user">
            <input
              type="checkbox"
              checked
              onChange={(e) => handleUserCheck(u.userId, e.target.checked)}
            />
            <span>
              {users.find((user) => user.id === u.userId)?.firstName} - role:
            </span>
            <select
              value={u.role}
              onChange={(e) => handleUserSelect(u.userId, e.target.value)}
              className="role-select"
            >
              <option value="MEMBER">MEMBER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="LEADER">LEADER</option>
            </select>
          </div>
        ))}
      </div>

      <button onClick={handleAddMembers} className="add-members-button">
        Add members
      </button>
    </div>
  );
};

export default AddTeamMembers;
