/* eslint-disable react/prop-types */
import { useState } from "react";
import ConfirmModal from "../ConfirmModal";
import { useSelector } from "react-redux";
import AccessToken from "../auth/AccessToken";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setOrganization } from "../store/organizationSlice";
const AddOwnerButton = ({ setToast, setIsLoading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showConfirm, setShowConfirm] = useState(false);
  const [userIdsInput, setUserIdsInput] = useState("");
  const orgId = useSelector((state) => state.organization.id);

  const userData = useSelector((state) => state.user);
  const handleAddOwners = async (retried = false) => {
    const accessToken = localStorage.getItem("accessToken");
    const userIds = userIdsInput
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id !== "");
    setIsLoading(true);
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
        setToast({ message: dataresponse.message, type: "success" });
      } else if (dataresponse.message === "Token expired" && !retried) {
        const newAccessToken = await AccessToken({
          userData,
          dispatch,
          navigate,
          setToast,
        });
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          userData.accessToken = newAccessToken;
          await handleAddOwners(true);
        } else {
          setToast({
            message: "Could not refresh session.",
            type: "error",
          });
        }
      } else {
        setToast({
          message: dataresponse.message || "Error occurred",
          type: "error",
        });
      }
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setShowConfirm(false);
      setIsLoading(false);
      setUserIdsInput("");
    }
  };
  if (!orgId) return null;

  return (
    <>
      {showConfirm && (
        <ConfirmModal
          message={
            <div>
              <p>Enter User ID(s) separated by comma:</p>
              <input
                type="text"
                placeholder="e.g. 123e4567, abc123"
                value={userIdsInput}
                onChange={(e) => setUserIdsInput(e.target.value)}
                className="confirm-input"
                required
              />
            </div>
          }
          onConfirm={handleAddOwners}
          onCancel={() => {
            setShowConfirm(false);
            setUserIdsInput("");
          }}
        />
      )}
      <div className="profile-action" onClick={() => setShowConfirm(true)}>
        <button className="profile-button">Add Owners to Organization</button>
      </div>
    </>
  );
};

export default AddOwnerButton;
