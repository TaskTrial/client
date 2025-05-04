//rfce
////////////////////////////////////////////////
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FaUniversity } from "react-icons/fa";

import { useLocation, useNavigate } from "react-router-dom";
import "../Styles/Profile.css";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import LoadingOverlay from "../LoadingOverlay";
import Toast from "../Toast";
import { useState } from "react";
import DeleteOrganizationButton from "./DeleteOrganizationButton";
import AddOwnerButton from "./AddOwnerButton";
import OrganizationOwners from "./OrganizationOwners";
import OrganizationMembers from "./OrganizationMembers";
import AddOwnerForm from "./AddOwnerForm";
const Organization = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orgData = useSelector((state) => state.organization);
  const user = useSelector((state) => state.user);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const orgPic = orgData.logoUrl;
  const owners = orgData.owners;
  const users = orgData.users;
  const formatDate = (dateString) => {
    if (!dateString) return "Invalid date";

    try {
      const date = new Date(dateString);
      if (isNaN(date)) return "Invalid date";

      const formattedDate = format(date, "MMM dd, yyyy HH:mm:ss");
      const hours = date.getHours();
      const period = hours >= 12 ? "PM" : "AM";

      return `${formattedDate} ${period}`;
    } catch (error) {
      return `${error.message}=>"Invalid date"`;
    }
  };

  const formattedDateJonn = formatDate(orgData.createdAt);
  const formattedDateUpdate = formatDate(orgData.updatedAt);
  const handleEditOrganization = () => {
    navigate("/Home/EditOrganization");
  };
  const back = () => {
    const from = location.state?.from;

    if (from) {
      navigate(from);
    } else {
      if (window.innerWidth > 768) {
        navigate("/Home/Profile");
      } else {
        navigate("/Home/More");
      }
    }
  };
  /////////
  console.log(orgData.createdBy);
  console.log(user.id);
  ////////
  // useEffect(() => {
  //   if (!hasFetched.current && userId && accessToken) {
  //     hasFetched.current = true;
  //     fetchOrganization();
  //   }
  // }, [userId, accessToken]);
  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="profile-container">
        <header className="profile-header" onClick={back}>
          <FaArrowLeft className="profile-back-icon" />
          <h6 className="profile-title">back</h6>
        </header>
        <h1 className="profile-top">My Organization</h1>
        <div className="profile-card">
          <div className="profile-avatar">
            {orgPic ? (
              <img src={orgPic} alt="Profile" className="editProfile-avatar" />
            ) : (
              <FaUniversity
                size={80}
                color="#5C4033"
                className="editProfile-avatar-icon"
              />
            )}
          </div>
          <h3 className="profile-name">{`${
            orgData.name ? orgData.name : "null"
          }`}</h3>
          <p className="profile-job">
            {orgData.industry ? orgData.industry : "null"}
          </p>

          <div className="profile-info">
            <p>
              <strong>contact Email</strong>
              {orgData.contactEmail}
            </p>
            <p>
              <strong>phone</strong>
              {orgData.contactPhone}
            </p>
            <p>
              <strong>Address</strong>
              {orgData.address}
            </p>
            <p>
              <strong>Size Range</strong>
              {orgData.sizeRange}
            </p>
            <p>
              <strong>website</strong>
              {orgData.website}
            </p>
            <p>
              <strong>Join At</strong>
              {formattedDateJonn}
            </p>
            <p>
              <strong>Updated At</strong>
              {formattedDateUpdate}
            </p>
            {orgData.createdBy !== user.id && (
              <>
                <p>
                  <strong>Created By:</strong> {orgData.createdBy}
                </p>
              </>
            )}
            {orgData.createdBy == user.id && (
              <>
                <p>
                  <strong>Join Code:</strong> {orgData.joinCode}
                </p>
              </>
            )}
          </div>
        </div>

        <OrganizationOwners owners={owners} />
        {orgData.createdBy == user.id && (
          <AddOwnerForm
            users={users}
            setToast={setToast}
            setIsLoading={setIsLoading}
          />
        )}

        <OrganizationMembers users={users} />

        <div className="profile-actions">
          <div className="profile-action" onClick={handleEditOrganization}>
            <button className="profile-button">
              <MdEdit size={18} />
              Edit Organization
            </button>
            <FaArrowRight className="profile-back-icon" />
          </div>
          <DeleteOrganizationButton
            setToast={setToast}
            setIsLoading={setIsLoading}
          />
          <AddOwnerButton setToast={setToast} setIsLoading={setIsLoading} />
        </div>
      </div>
    </>
  );
};

export default Organization;
