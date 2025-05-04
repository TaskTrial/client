/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MdPeople } from "react-icons/md";
import ConfirmModal from "../ConfirmModal";
import { useNavigate } from "react-router-dom";
import AccessToken from "../auth/AccessToken";
import { useDispatch } from "react-redux";
const GetAllUsersButton = ({ setToast, setIsLoading }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [users, setUsers] = useState([]);
  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fetchUsers = async (retried = false) => {
    const accessToken = localStorage.getItem("accessToken");
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/users?page=1`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
      } else if (data.message === "Token expired" && !retried) {
        const newAccessToken = await AccessToken({
          userData,
          dispatch,
          navigate,
          setToast,
        });

        if (newAccessToken) {
          userData.accessToken = newAccessToken;
          await fetchUsers({ retried: true });
        } else {
          setToast({ message: "Could not refresh session.", type: "error" });
        }
      } else {
        setToast({ message: data.message || "Fetch failed", type: "error" });
      }
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData.role === "admin") {
      fetchUsers();
    }
  }, [userData.role]);

  if (userData.role !== "admin") return null;

  return (
    <>
      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to view all users?"
          onConfirm={fetchUsers}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <div className="profile-action" onClick={() => setShowConfirm(true)}>
        <button className="profile-button">
          <MdPeople size={18} />
          View All Users
        </button>
      </div>

      <div className="users-list">
        {users.map((userItem) => (
          <div key={userItem.id} className="user-item">
            <p>
              <strong>Name:</strong> {userItem.firstName} {userItem.lastName}
            </p>
            <p>
              <strong>Email:</strong> {userItem.email}
            </p>
            <p>
              <strong>Role:</strong> {userItem.role}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default GetAllUsersButton;
