/* eslint-disable react/prop-types */
import "../Styles/OrganizationMembers.css";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

const OrganizationMembers = ({ users }) => {
  console.log(users);
  const members = users.filter((user) => !user.isOwner);
  const user = useSelector((state) => state.user);

  if (members.length === 0) {
    return <p className="no-members">No members found.</p>;
  }

  return (
    <div className="members-wrapper">
      <h4 className="members-title">Organization Members</h4>
      <div className="members-container">
        {members.map((member) => (
          <div key={member.id} className="member-card">
            {member.id == user.id && (
              <>
                <h5>Me</h5>
              </>
            )}
            {member.profilePic ? (
              <img
                src={member.profilePic}
                alt="Member"
                className="member-image"
              />
            ) : (
              <FaUserCircle size={50} className="member-icon" />
            )}
            <div className="member-details">
              <h3>
                {member.firstName} {member.lastName}
              </h3>
              <p>Email: {member.email}</p>
              <p>Job Title: {member.jobTitle}</p>
              <p>Department: {member.department?.name || "N/A"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizationMembers;
