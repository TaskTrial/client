/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaUserCircle, FaUpload, FaTrash, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AccessToken from "../auth/AccessToken";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
const ProfileImageUploader = ({
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
  const userId = userData.id;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Only allow safe image MIME types (extra defense)
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/webp"
      ];
      if (
        !allowedTypes.includes(file.type) ||
        (file.name && file.name.toLowerCase().endsWith(".svg"))
      ) {
        setToast &&
          setToast({
            type: "error",
            message: "Only JPEG, PNG, GIF, BMP, or WEBP images are allowed for profile pictures.",
          });
        return;
      }
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (retried = false) => {
    if (!selectedFile) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${userId}/profile-picture`,
        {
          method: "POST",
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );
      const data = await response.json();
      if (response.ok) {
        setToast({ message: data.message, type: "success" });
        setCurrentPic(data.user.profilePic);
        setPreviewImage(null);
        setSelectedFile(null);
        onUploadSuccess(data); // حدث بيانات الريدكس
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
          setToast({
            message: "Could not refresh session.",
            type: "error",
          });
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
    if (!currentPic) {
      setPreviewImage(null);
      setSelectedFile(null);
      return;
    }
    const accessToken = localStorage.getItem("accessToken");
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${userId}/profile-picture`,
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
        setCurrentPic(null); // نحذف الصورة من الواجهة
        setPreviewImage(null);
        setSelectedFile(null);
        onUploadSuccess(data); // تحديث الريدكس بالصورة الجديدة
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

  // Helper function to check for safe image URLs (block SVG)
  function isSafeImageSrc(src) {
    if (!src || typeof src !== "string") return false;
    // Block SVG images for security reasons (SVG can contain script)
    if (
      src.endsWith('.svg') ||
      src.toLowerCase().includes('image/svg+xml') ||
      src.toLowerCase().includes('svg%3') // Encoded SVG
    ) return false;
    // Allow blob URLs -- checked above for SVG
    if (src.startsWith("blob:")) return true;
    // Allow data URLs for safe image types only (jpeg, png, gif, bmp, webp)
    if (/^data:image\/(jpeg|png|gif|bmp|webp);base64,/i.test(src)) return true;
    // Allow http or https URLs with common image extensions (except svg)
    if (/^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(src)) return true;
    // Reject all others for safety
    return false;
  }

          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
  return (
    <div className="editProfile-avatar-section">
      {isSafeImageSrc(imageToDisplay) ? (
        <img
          src={imageToDisplay}
          alt="Profile"
          className="editProfile-avatar"
        />
      ) : (
        <FaUserCircle size={80} className="editProfile-avatar-icon" />
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

export default ProfileImageUploader;
