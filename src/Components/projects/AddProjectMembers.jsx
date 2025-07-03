/* eslint-disable react/prop-types */
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AccessToken from "../auth/AccessToken";
import { useDispatch } from "react-redux";
const AddProjectMembers = ({ projectId, teamId, setToast, setIsLoading }) => {
  const orgId = localStorage.getItem("orgId");
  const members = useSelector((state) => state.team.members);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectableMembers, setSelectableMembers] = useState(members);
  const handleChange = (e) => {
    const options = Array.from(e.target.selectedOptions);
    const values = options.map((opt) => opt.value);
    setSelectedMembers(values);
  };

  const handleSubmit = async (retried = false) => {
    if (selectedMembers.length === 0) {
      return setToast({
        message: "Please select at least one member",
        type: "error",
      });
    }

    const payload = {
      members: selectedMembers.map((id) => ({
        userId: id,
        role: "MEMBER",
      })),
    };

    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `http://localhost:3000/api/organization/${orgId}/team/${teamId}/project/${projectId}/addMember`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        const updatedMembers = selectableMembers.filter(
          (member) => !selectedMembers.includes(member.user.id)
        );
        setSelectableMembers(updatedMembers);

        setToast({
          message: data.message || "Members added successfully",
          type: "success",
        });
        setSelectedMembers([]);
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
          await handleSubmit(true);
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
        padding: "1rem",
        marginTop: "1rem",
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <h3 style={{ color: "#ff8c42", marginBottom: "0.5rem" }}>
        Add Members to Project
      </h3>

      <label
        htmlFor="memberSelect"
        style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}
      >
        Select Members:
      </label>
      <select
        id="memberSelect"
        multiple
        value={selectedMembers}
        onChange={handleChange}
        style={{
          width: "100%",
          minHeight: "100px",
          padding: "0.5rem",
          borderRadius: "8px",
          border: "1px solid #aaa",
          marginBottom: "1rem",
        }}
      >
        {selectableMembers.map((member) => (
          <option key={member.id} value={member.user.id}>
            {`${member.user.firstName} ${member.user.lastName} (${member.user.email})`}
          </option>
        ))}
      </select>

      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: "#ff8c42",
          color: "#fff",
          padding: "0.6rem 1.2rem",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "background 0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#e6762f")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#ff8c42")}
      >
        Add Selected Members
      </button>
    </div>
  );
};

export default AddProjectMembers;
