/* eslint-disable react/prop-types */

import "../Styles/OrganizationOwners.css";
import { FaUserCircle } from "react-icons/fa";
const OrganizationOwners = ({ owners }) => {
  if (!owners || owners.length === 0) {
    return <p className="no-owners">No owners found.</p>;
  }

  return (
    <>
      <h3>Owners</h3>
      <div className="owners-container">
        {owners.map((owner) => (
          <div key={owner.id} className="owner-card">
            {owner.profileImage ? (
              <img
                src={owner.profileImage}
                alt="user"
                className="owner-image"
              />
            ) : (
              <FaUserCircle size={50} className="editProfile-avatar-icon" />
            )}
            <div className="owner-info">
              <h3 className="owner-name">{owner.name}</h3>
              <p className="owner-email">{owner.email}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default OrganizationOwners;
