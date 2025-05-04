import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setDepartment } from "../store/departmentSlice";
import Toast from "../Toast";
import { FaArrowLeft } from "react-icons/fa";
import SmallSpinner from "../SmallSpinner";

import AccessToken from "../auth/AccessToken";
import LoadingOverlay from "../LoadingOverlay";
import "../Styles/EditDepartment.css";
const EditDepartment = () => {
  //   const { departmentId, organizationId } = useParams();
  const deptData = useSelector((state) => state.department);
  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const onSubmitHandler = (e) => {
    e.preventDefault();
    handleSubmit();
  };
  const handleSubmit = async (retried = false) => {
    if (!formData.name.trim() || !formData.description.trim()) {
      setToast({
        message: "Name and Description are required!",
        type: "error",
      });
      return;
    }
    const orgId = deptData.organizationId;
    const deptId = deptData.id;
    const accessToken = localStorage.getItem("accessToken");
    const beforepayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
    };
    const payload = Object.fromEntries(
      Object.entries(beforepayload).filter(([, value]) => value !== "")
    );
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/organizations/${orgId}/departments/${deptId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (response.ok) {
        dispatch(setDepartment(data));
        setToast({ message: data.message, type: "success" });
        setFormData({ name: "", description: "" });
        setTimeout(() => navigate(`/Home/Departments/${deptId}`), 1500);
      } else if (data.message === "Token expired" && !retried) {
        const newToken = await AccessToken({
          userData,
          dispatch,
          navigate,
          setToast,
        });

        if (newToken) {
          userData.accessToken = newToken;
          localStorage.setItem("accessToken", newToken);

          await handleSubmit(true);
        } else {
          setToast({
            message: "Token expired. Please login again",
            type: "error",
          });
        }
      } else {
        setToast({
          message: data.message || "Failed to update department",
          type: "error",
        });
      }
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="edit-dept-container">
        <header
          className="profile-header"
          onClick={() => navigate(`/Home/Departments/${deptData.id}`)}
        >
          <FaArrowLeft className="profile-back-icon" />
          <h6 className="profile-title">my Department</h6>
        </header>
        <h2>Edit Department</h2>
        <form className="edit-dept-form" onSubmit={onSubmitHandler}>
          <label>
            Name *
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="EX:Financial Considerations Section"
            />
          </label>
          <label>
            Description *
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="This department is responsible for the company's financial situation."
            />
          </label>
          <button type="submit" disabled={isLoading}>
            {isLoading ? <SmallSpinner /> : "Save Changes"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditDepartment;
