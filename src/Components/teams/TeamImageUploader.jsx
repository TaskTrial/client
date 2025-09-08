/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaUpload, FaTrash, FaCheck, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AccessToken from "../auth/AccessToken";
import { useSelector, useDispatch } from "react-redux";


// Helper function to check image magic numbers for PNG, JPEG, GIF, WEBP
async function isAllowedImageMagicNumber(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      const arr = new Uint8Array(e.target.result);
      // PNG: 89 50 4E 47 0D 0A 1A 0A
      if (arr.length > 7 && arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4E && arr[3] === 0x47 && arr[4] === 0x0D && arr[5] === 0x0A && arr[6] === 0x1A && arr[7] === 0x0A) {
        resolve(true);
        return;
      }
      // JPEG: FF D8 FF
      if (arr.length > 2 && arr[0] === 0xFF && arr[1] === 0xD8 && arr[2] === 0xFF) {
        resolve(true);
        return;
      }
      // GIF: GIF87a or GIF89a
      if (arr.length > 5 &&
        arr[0] === 0x47 && arr[1] === 0x49 && arr[2] === 0x46 &&
        arr[3] === 0x38 && (arr[4] === 0x39 || arr[4] === 0x37) && arr[5] === 0x61) {
        resolve(true);
        return;
      }
      // WEBP: RIFF....WEBP
      if (arr.length > 11 &&
        arr[0] === 0x52 && arr[1] === 0x49 && arr[2] === 0x46 && arr[3] === 0x46 &&
        arr[8] === 0x57 && arr[9] === 0x45 && arr[10] === 0x42 && arr[11] === 0x50) {
        resolve(true);
        return;
      }
      resolve(false);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file.slice(0, 16));
  });
}

const TeamImageUploader = ({ profilePicFromApi, setToast, setIsLoading }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPic, setCurrentPic] = useState(profilePicFromApi);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const teamsData = useSelector((state) => state.team);
  const teamId = teamsData.team.id;
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Only allow certain safe image types (no SVG!)
      const allowedImageTypes = [
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/webp",
        // Add more safe image MIME types as needed
      ];
      // Block SVG: by mime type, extension, and generic sniffing
      const isSvgType = file.type === "image/svg+xml" || (file.name && file.name.toLowerCase().endsWith(".svg"));
      if (isSvgType || !allowedImageTypes.includes(file.type)) {
        setToast({ message: "Only PNG, JPEG, GIF, or WEBP images are allowed. SVG files are not accepted for security reasons.", type: "error" });
        e.target.value = '';
        return;
      }
      // Magic number check (extra defense against SVG/malicious polyglot files)
      const magicOk = await isAllowedImageMagicNumber(file);
      if (!magicOk) {
        setToast({ message: "This file does not appear to be a valid PNG, JPEG, GIF, or WEBP image.", type: "error" });
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
