/* eslint-disable react/prop-types */
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AccessToken from "../auth/AccessToken";
import { useNavigate } from "react-router-dom";
import { setOrganization } from "../store/organizationSlice";

const AddOwnerForm = ({ users, setToast, setIsLoading }) => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const userData = useSelector((state) => state.user);
  const orgId = useSelector((state) => state.organization.id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddOwner = async (retried = false) => {
    if (!selectedUserId) {
      setToast({ message: "Please select a user", type: "error" });
      return;
    }
    const userIds = selectedUserId
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id !== "");
    setIsLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `http://localhost:3000/api/organization/${orgId}/addOwner`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ userIds }),
        }
      );

      const dataresponse = await response.json();

      if (response.ok) {
        dispatch(setOrganization(dataresponse)); //not essential
        const existingOrgData =
          JSON.parse(localStorage.getItem("dataOrganization")) || {};
        const updatedOrgData = {
          ...existingOrgData,
          ...dataresponse.data,
        };
        localStorage.setItem(
          "dataOrganization",
          JSON.stringify(updatedOrgData)
        );
        setToast({
          message: dataresponse.message || "Owner added successfully",
          type: "success",
        });
        setSelectedUserId("");
      } else if (dataresponse.message === "Token expired" && !retried) {
        const newAccessToken = await AccessToken({
          userData,
          dispatch,
          navigate,
          setToast,
        });

        if (newAccessToken) {
          userData.accessToken = newAccessToken;
          localStorage.setItem("accessToken", newAccessToken);
          await handleAddOwner(true);
        }
      } else {
        setToast({
          message: dataresponse.message || "Failed to add owner",
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
    <div style={{ marginTop: "1rem", textAlign: "center" }}>
      <h4 style={{ marginBlock: "5px" }}>Make a user an owner</h4>
      <select
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "15px",
          marginRight: "10px",
          textAlign: "center",
        }}
      >
        <option value="">-- Select User --</option>
        {users.map(
          (user) =>
            !user.isOwner && (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName} - {user.email}
              </option>
            )
        )}
      </select>
      <button
        onClick={handleAddOwner}
        style={{
          padding: "10px 15px",
          borderRadius: "10px",
          backgroundColor: "var(--thirdColor)",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Add
      </button>
    </div>
  );
};

export default AddOwnerForm;
