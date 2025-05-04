/* eslint-disable react/prop-types */
import { FaTrash } from "react-icons/fa";
import ConfirmModal from "../ConfirmModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccessToken from "../auth/AccessToken";
import { useSelector, useDispatch } from "react-redux";

const DeleteMemberButton = ({ setToast, setIsLoading }) => {
  // const { departmentId } = useParams();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const team = useSelector((state) => state.team.team);
  const teamId = team.id;
  const creator = team.creator;
  const members = useSelector((state) => state.team.members);
  const handleDeleteTeamMember = async (retried = false) => {
    if (!selectedMemberId) return;
    const orgId = await userData?.organization?.id;
    setIsLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `http://localhost:3000/api/organization/${orgId}/team/${teamId}/members/${selectedMemberId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setToast({
          message: data.message || "Department deleted",
          type: "success",
        });
        setTimeout(() => {
          navigate("/Home/Teams");
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
          await handleDeleteTeamMember(true);
        } else {
          setToast({
            message: "Could not refresh session.",
            type: "error",
          });
        }
      } else {
        setToast({ message: data.message || "Delete failed", type: "error" });
      }
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this Team?"
          onConfirm={handleDeleteTeamMember}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <div className="profile-action deleteaction">
        <select
          value={selectedMemberId}
          onChange={(e) => setSelectedMemberId(e.target.value)}
          className="select-user"
        >
          <option value="">-- Select member to delete --</option>
          {members
            .filter((member) => member.user.id !== creator.id)
            .map((member) => (
              <option key={member.id} value={member.id}>
                {member.user.firstName} {member.user.lastName} -{" "}
                {member.user.email}
              </option>
            ))}
        </select>

        <button
          className="profile-button"
          style={{ backgroundColor: "#dc3545" }}
          disabled={!selectedMemberId}
          onClick={() => setShowConfirm(true)}
        >
          <FaTrash size={18} />
          Delete Team
        </button>
      </div>
    </>
  );
};

export default DeleteMemberButton;
