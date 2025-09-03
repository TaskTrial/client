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

  // Helper to read file and validate its magic number (content signature)
  async function isFileImageBySignature(file) {
    return new Promise((resolve) => {
      const fileSigs = {
        jpg: [[0xFF, 0xD8, 0xFF]],
        png: [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
        gif: [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61], [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]],
        bmp: [[0x42, 0x4D]],
        webp: [[0x52, 0x49, 0x46, 0x46]] // Need to additionally check `WEBP` in bytes 8-11
      };
      const reader = new FileReader();
      reader.onloadend = function(e) {
        const arr = new Uint8Array(e.target.result);
        // JPEG
        if (arr.length >= 3 && arr[0] === 0xFF && arr[1] === 0xD8 && arr[2] === 0xFF) return resolve(true);
        // PNG
        if (arr.length >= 8 &&
          arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4E && arr[3] === 0x47 &&
          arr[4] === 0x0D && arr[5] === 0x0A && arr[6] === 0x1A && arr[7] === 0x0A) return resolve(true);
        // GIF
        if (arr.length >= 6 &&
          ((arr[0] === 0x47 && arr[1] === 0x49 && arr[2] === 0x46 && arr[3] === 0x38 &&
            ((arr[4] === 0x37 && arr[5] === 0x61) || (arr[4] === 0x39 && arr[5] === 0x61))))) return resolve(true);
        // BMP
        if (arr.length >= 2 && arr[0] === 0x42 && arr[1] === 0x4D) return resolve(true);
        // WEBP (RIFF....WEBP)
        if (arr.length >= 12 && arr[0] === 0x52 && arr[1] === 0x49 && arr[2] === 0x46 && arr[3] === 0x46 &&
                              arr[8] === 0x57 && arr[9] === 0x45 && arr[10] === 0x42 && arr[11] === 0x50) return resolve(true);
        resolve(false);
      };
      // Read enough bytes for all magic headers (12 is enough for all above types)
      reader.readAsArrayBuffer(file.slice(0, 12));
    });
  }

  const handleFileChange = async (e) => {
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
      // Check for allowed types, and block SVG in type, ext, or mimetype (double check)
      const isSvgType = (file.type && file.type.toLowerCase().includes("svg"));
      const isSvgExt = (file.name && file.name.toLowerCase().endsWith(".svg"));
      const isSvgMime = (file.type && file.type.toLowerCase().includes("image/svg+xml"));
      if (
        !allowedTypes.includes(file.type) ||
        isSvgType ||
        isSvgExt ||
        isSvgMime
      ) {
        setSelectedFile(null);
        setPreviewImage(null);
        setToast &&
          setToast({
            type: "error",
            message: "Only JPEG, PNG, GIF, BMP, or WEBP images are allowed for profile pictures.",
          });
        return;
      }
      // Now check signature
      const isImageSignature = await isFileImageBySignature(file);
      if (!isImageSignature) {
        setSelectedFile(null);
        setPreviewImage(null);
        setToast &&
          setToast({
            type: "error",
            message: "The selected file is not a valid image. Only JPEG, PNG, GIF, BMP, WEBP images are supported.",
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
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
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
