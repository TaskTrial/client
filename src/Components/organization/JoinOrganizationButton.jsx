/* eslint-disable react/prop-types */
import { useState } from "react";
import ConfirmModal from "../ConfirmModal";
import { useSelector, useDispatch } from "react-redux";
import AccessToken from "../auth/AccessToken";
import { useNavigate } from "react-router-dom";

const JoinOrganizationButton = ({ setToast, setIsLoading }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleJoinOrganization = async (retried = false) => {
    const accessToken = localStorage.getItem("accessToken");
    setIsLoading(true);
    if (!joinCode || joinCode.trim() === "") {
      setToast({ message: "Join code is required", type: "error" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/organization/join",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ joinCode: joinCode.trim() }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setToast({
          message: data.message || "Joined successfully",
          type: "success",
        });
        const existingOrgData =
          JSON.parse(localStorage.getItem("dataOrganization")) || {};
        const updatedOrgData = {
          ...existingOrgData,
          ...data.organization,
        };
        localStorage.setItem(
          "dataOrganization",
          JSON.stringify(updatedOrgData)
        );
        setShowConfirm(false);
        setJoinCode("");
        setTimeout(() => {
          navigate("/Home");
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
          await handleJoinOrganization(true);
        }
      } else {
        setToast({ message: data.message || "Join failed", type: "error" });
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
          message={
            <div>
              <h3>Join Organization</h3>
              <p>Enter your join code below</p>
              <input
                type="text"
                placeholder="Join Code (e.g. ABCD-1234)"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                style={{ padding: "15px", borderRadius: "10px", width: "100%" }}
              />
            </div>
          }
          onConfirm={handleJoinOrganization}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <button
        onClick={() => setShowConfirm(true)}
        className="create-organization-button"
      >
        Or join to organization
      </button>
    </>
  );
};

export default JoinOrganizationButton;
