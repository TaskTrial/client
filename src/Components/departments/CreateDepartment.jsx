import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setDepartment } from "../store/departmentSlice";
import Toast from "../Toast";
import AccessToken from "../auth/AccessToken";
import LoadingOverlay from "../LoadingOverlay";
import SmallSpinner from "../SmallSpinner";
import "../Styles/CreateDepartment.css";
import { FaArrowLeft } from "react-icons/fa";

const CreateDepartment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const organizationId = useSelector((state) => state.organization.id);
  const userData = useSelector((state) => state.user);
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
    setIsLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    const beforepayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
    };
    const payload = Object.fromEntries(
      Object.entries(beforepayload).filter(([, value]) => value !== "")
    );
    try {
      const response = await fetch(
        `http://localhost:3000/api/organizations/${organizationId}/departments/create`,
        {
          method: "POST",
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
        setTimeout(() => navigate("/Home/Departments"), 1500);
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
          message: data.message || "Failed to create department",
          type: "error",
        });
      }
    } catch (error) {
      setToast({ message: error.message, type: "error" });
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
      <div className="create-department-container">
        <form className="create-department-form" onSubmit={onSubmitHandler}>
          <header
            className="create-organization-header"
            onClick={() => {
              if (window.innerWidth > 768) {
                navigate("/Home");
              } else {
                navigate("/Home/More");
              }
            }}
          >
            <FaArrowLeft className="create-organization-back-icon" />
            <h6 className="create-organization-title">back</h6>
          </header>
          <h2>Create Department</h2>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              required
              onChange={handleChange}
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              required
              onChange={handleChange}
            />
          </label>
          <button type="submit" disabled={isLoading}>
            {isLoading ? <SmallSpinner /> : "Create"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateDepartment;
