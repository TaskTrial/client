/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaUserCircle, FaUpload, FaTrash, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AccessToken from "../../auth/AccessToken";
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
  const user = useSelector((state) => state.user);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (retried = false) => {
    if (!selectedFile) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${user.userId}/profile-picture`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
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
          refreshToken: user.refreshToken,
          user,
          dispatch,
          navigate,
          setToast,
        });
        if (newAccessToken) {
          user.accessToken = newAccessToken;
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
    // لو مفيش صورة جاية من الباك أصلاً
    if (!currentPic) {
      setPreviewImage(null);
      setSelectedFile(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${user.userId}/profile-picture`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
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
          refreshToken: user.refreshToken,
          user,
          dispatch,
          navigate,
          setToast,
        });
        if (newAccessToken) {
          user.accessToken = newAccessToken;
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
