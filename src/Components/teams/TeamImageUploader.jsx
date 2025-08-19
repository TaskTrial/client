/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaUpload, FaTrash, FaCheck, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AccessToken from "../auth/AccessToken";
import { useSelector, useDispatch } from "react-redux";

const TeamImageUploader = ({ profilePicFromApi, setToast, setIsLoading }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPic, setCurrentPic] = useState(profilePicFromApi);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const teamsData = useSelector((state) => state.team);
  const teamId = teamsData.team.id;
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Block SVG files for security
      const isSvg = file.type === "image/svg+xml" || (file.name && file.name.toLowerCase().endsWith(".svg"));
      if (isSvg) {
        setToast({ message: "SVG files are not allowed for security reasons.", type: "error" });
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (retried = false) => {
    const accessToken = localStorage.getItem("accessToken");
    const orgId = await userData?.organization?.id;
    if (!selectedFile) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch(
        `http://localhost:3000/api/organization/${orgId}/team/${teamId}/avatar/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );
      const data = await response.json();
      if (response.ok) {
        setToast({ message: data.message, type: "success" });
        setCurrentPic(data.logoUrl);
        setPreviewImage(null);
        setSelectedFile(null);
      } else if (data.message === "Token expired" && !retried) {
        const newAccessToken = await AccessToken({
          userData,
          dispatch,
          navigate,
          setToast,
        });
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          userData.accessToken = newAccessToken;
          await handleUpload(true);
        } else {
          setToast({ message: "Could not refresh session.", type: "error" });
        }
      } else {
        setToast({ message: data.message || "Upload failed", type: "error" });
      }
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (retried = false) => {
    const accessToken = localStorage.getItem("accessToken");
    const orgId = await userData?.organization?.id;
    if (!currentPic) {
      setPreviewImage(null);
      setSelectedFile(null);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/organization/${orgId}/team/${teamId}/avatar/delete`,
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
          message: data.message || "Profile picture deleted",
          type: "success",
        });
        setCurrentPic(null);
        setPreviewImage(null);
        setSelectedFile(null);
      } else if (data.message === "Token expired" && !retried) {
        const newAccessToken = await AccessToken({
          userData,
          dispatch,
          navigate,
          setToast,
        });
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          userData.accessToken = newAccessToken;
          await handleDelete(true);
        } else {
          setToast({
            message: "Could not refresh session.",
            type: "error",
          });
        }
      } else {
        setToast({
          message: data.message || "Failed to delete image",
          type: "error",
        });
      }
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const imageToDisplay = previewImage || currentPic;

  return (
    <div className="editProfile-avatar-section">
      {imageToDisplay ? (
        <img src={imageToDisplay} alt="Team" className="editProfile-avatar" />
      ) : (
        <FaUsers
          size={80}
          color="#5C4033"
          className="editProfile-avatar-icon"
        />
      )}

      <div className="editProfile-avatar-buttons">
        <label htmlFor="uploadInput" className="editProfile-icon-button upload">
          <FaUpload />
        </label>
        <input
          id="uploadInput"
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />

        <button
          type="button"
          className="editProfile-icon-button delete"
          onClick={handleDelete}
        >
          <FaTrash />
        </button>

        <button
          type="button"
          className="editProfile-icon-button confirm"
          onClick={handleUpload}
          disabled={!selectedFile}
        >
          <FaCheck />
        </button>
      </div>
    </div>
  );
};

export default TeamImageUploader;
