import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import "../Styles/EditProfile.css";
import Toast from "../Toast";
import { useNavigate } from "react-router-dom";
import AccessToken from "../auth/AccessToken";
import LoadingOverlay from "../LoadingOverlay";
import ProfileImageUploader from "./ProfileImageUploader";
///////
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getUser } from "../store/userSlice";
const EditProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [formDataState, setFormDataState] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    jobTitle: userData.jobTitle || "",
    phoneNumber: userData.phoneNumber || "",
    bio: userData.bio || "",
  });

  const handleInputChange = (e) => {
    setFormDataState({ ...formDataState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, retried = false) => {
    e.preventDefault();
    setIsLoading(true);
    const userId = userData.id;
    const accessToken = localStorage.getItem("accessToken");
    const beforepayload = {
      firstName: formDataState.firstName.toLowerCase().trim(),
      lastName: formDataState.lastName.toLowerCase().trim(),
      jobTitle: formDataState.jobTitle.toLowerCase().trim(),
      phoneNumber: formDataState.phoneNumber.toLowerCase().trim(),
      bio: formDataState.bio.toLowerCase().trim(),
    };
    const payload = Object.fromEntries(
      Object.entries(beforepayload).filter(([, value]) => value !== "")
    );

    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${userId}`,
        {
          method: "PUT",
          // credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (response.ok) {
        dispatch(getUser(data));
        const existingUserData =
          JSON.parse(localStorage.getItem("getUser")) || {};
        const updatedUserData = {
          ...existingUserData,
          ...data.user,
        };
        localStorage.setItem("getUser", JSON.stringify(updatedUserData));
        setToast({
          message: data.message || "Data saved successfully",
          type: "success",
        });
      } else if (data.message === "Token expired" && !retried) {
        const newAccessToken = await AccessToken({
          userData,
          dispatch,
          navigate,
          setToast,
        });
        if (newAccessToken) {
          userData.accessToken = newAccessToken;
          await handleSubmit(e, true);
        } else {
          setToast({
            message: "Could not refresh session.",
            type: "error",
          });
        }
      } else {
        console.log("from editprofile");
        setToast({
          message: data.message || "An error occurred while saving.",
          type: "error",
        });
      }
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  const backToProfile = () => {
    navigate("/Home");
  };
  return (
    <div className="editProfile-container">
      <LoadingOverlay isLoading={isLoading} />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <header className="editProfile-header" onClick={backToProfile}>
        <FaArrowLeft className="editProfile-back-icon" />
        <h6 className="editProfile-title">Profile</h6>
      </header>
      <h1 className="EditProfile-top">EditProfile</h1>
      <ProfileImageUploader
        profilePicFromApi={userData.profilePic}
        setToast={setToast}
        setIsLoading={setIsLoading}
        onUploadSuccess={(updatedUser) => dispatch(getUser(updatedUser))}
      />
      {/* <div className="editProfile-avatar-section">
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="editProfile-avatar"
          />
        ) : (
          <FaUserCircle size={80} className="editProfile-avatar-icon" />
        )}
        <div className="editProfile-avatar-buttons">
          <label
            htmlFor="uploadInput"
            className="editProfile-icon-button upload"
          >
            <FaUpload />
          </label>
          <input id="uploadInput" type="file" accept="image/*" hidden />

          <button className="editProfile-icon-button delete">
            <FaTrash />
          </button>

          <button className="editProfile-icon-button confirm">
            <FaCheck />
          </button>
        </div>
      </div> */}

      <form className="editProfile-form" onSubmit={handleSubmit}>
        <label>
          First Name
          <input
            name="firstName"
            value={formDataState.firstName}
            onChange={handleInputChange}
            type="text"
            placeholder="first Name"
          />
        </label>

        <label>
          Last Name
          <input
            name="lastName"
            value={formDataState.lastName}
            onChange={handleInputChange}
            type="text"
            placeholder="last name"
          />
        </label>

        <label>
          Job Title
          <input
            name="jobTitle"
            value={formDataState.jobTitle}
            onChange={handleInputChange}
            type="text"
            placeholder="jobTitle"
          />
        </label>

        <label>
          Phone
          <input
            name="phoneNumber"
            value={formDataState.phoneNumber}
            onChange={handleInputChange}
            type="text"
            placeholder="0115883180"
          />
        </label>

        <label>
          Bio
          <textarea
            name="bio"
            value={formDataState.bio}
            onChange={handleInputChange}
            placeholder="Computer Enginnering"
            maxLength="100"
          />
          <div className="editProfile-charcount">20/100</div>
        </label>

        <button type="submit" className="editProfile-save-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
