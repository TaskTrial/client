/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaUpload, FaTrash, FaCheck, FaUniversity } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AccessToken from "../auth/AccessToken";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
const OrganizationImageUploader = ({
  profilePicFromApi,
  setToast,
  onUploadSuccess,
  setIsLoading,
}) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPic, setCurrentPic] = useState(profilePicFromApi);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const orgId = userData.organization?.id;
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (retried = false) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!selectedFile) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch(
        `http://localhost:3000/api/organization/${orgId}/logo/upload`,
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
        console.log("111");
        setCurrentPic(data.logoUrl);
        setPreviewImage(null);
        setSelectedFile(null);
        onUploadSuccess(data);
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
          await handleUpload(true, newAccessToken);
        } else {
          setToast({
            message: "Could not refresh session.",
            type: "error",
          });
        }
      } else {
        setToast({ message: data.message || "Upload failed", type: "error" });
      }
    } catch (error) {
      console.log("444");
      setToast({ message: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (retried = false) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!currentPic) {
      setPreviewImage(null);
      setSelectedFile(null);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/organization/${orgId}/logo/delete`,
        {
          method: "DELETE",
          headers: {
            // "Content-Type": "application/json",
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
        onUploadSuccess(data);
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
          await handleDelete(true, newAccessToken);
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
        <img
          src={imageToDisplay}
          alt="Profile"
          className="editProfile-avatar"
        />
      ) : (
        <FaUniversity
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

export default OrganizationImageUploader;
