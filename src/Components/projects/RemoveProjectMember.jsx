/* eslint-disable react/prop-types */
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AccessToken from "../auth/AccessToken";
import { useDispatch } from "react-redux";
const RemoveProjectMember = ({ teamId, projectId, setToast, setIsLoading }) => {
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const members = useSelector((state) => state.project.members);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const [currentMembers, setCurrentMembers] = useState(members);

  const orgId = localStorage.getItem("orgId");

  const handleRemove = async (retried = false) => {
    if (!selectedMemberId) {
      return setToast({
        message: "Please select a member to remove",
        type: "error",
      });
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `http://localhost:3000/api/organization/${orgId}/team/${teamId}/project/${projectId}/removeMember`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ userId: selectedMemberId }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setToast({ message: "Member removed successfully", type: "success" });
        setCurrentMembers(
          currentMembers.filter((m) => m.user.id !== selectedMemberId)
        );
        setSelectedMemberId("");
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
          await handleRemove(true);
        } else {
          setToast({
            message: "Could not refresh session.",
            type: "error",
          });
        }
      } else {
        setToast({
          message: data.message || "Failed to remove member",
          type: "error",
        });
      }
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        marginTop: "2rem",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "12px",
      }}
    >
      <h3 style={{ color: "#ff8c42", marginBottom: "1rem" }}>
        Remove Member from Project
      </h3>

      <select
        onChange={(e) => setSelectedMemberId(e.target.value)}
        value={selectedMemberId}
        style={{
          width: "100%",
          padding: "0.5rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "1rem",
        }}
      >
        <option value="">-- Select Member --</option>
        {currentMembers
          .filter((member) => member.role !== "PROJECT_OWNER")
          .map((member) => (
            <option key={member.id} value={member.user.id}>
              {member.user.firstName} {member.user.lastName} (
              {member.user.email})
            </option>
          ))}
      </select>

      <button
        onClick={handleRemove}
        style={{
          backgroundColor: "#dc3545",
          color: "#fff",
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Remove Member
      </button>
    </div>
  );
};

export default RemoveProjectMember;
