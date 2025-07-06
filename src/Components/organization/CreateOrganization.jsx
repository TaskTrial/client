import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../Styles/CreateOrganization.css";
import Toast from "../Toast";
import LoadingOverlay from "../LoadingOverlay";
import { useDispatch } from "react-redux";
import { setOrganization } from "../store/organizationSlice";
import AccessToken from "../auth/AccessToken";
import JoinOrganizationButton from "./JoinOrganizationButton";

const CreateOrganization = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  // const org = useSelector((state) => state.organization);
  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    sizeRange: "",
    contactEmail: "",
    orgOwnerId: "",
  });
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e, retried = false) => {
    e.preventDefault();
    setIsLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    const beforepayload = {
      name: formData.name.trim(),
      industry: formData.industry.trim(),
      sizeRange: formData.sizeRange.trim(),
      contactEmail: formData.contactEmail.trim(),
      orgOwnerId: formData.orgOwnerId.trim(),
    };
    const payload = Object.fromEntries(
      Object.entries(beforepayload).filter(([, value]) => value !== "")
    );
    try {
      const response = await fetch("http://localhost:3000/api/organization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const dataresponse = await response.json();

      if (response.ok) {
        localStorage.setItem(
          "dataOrganization",
          JSON.stringify(dataresponse.data.organization)
        );
        localStorage.setItem(
          "organizationOwner",
          JSON.stringify(dataresponse.organizationOwner)
        );
        dispatch(setOrganization(dataresponse));
        setToast({ message: dataresponse.message, type: "success" });
        setTimeout(() => navigate("/Home"), 1500);
      } else if (dataresponse.message === "Token expired" && !retried) {
        const newAccessToken = await AccessToken({
          userData,
          dispatch,
          navigate,
          setToast,
        });
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          userData.accessToken = newAccessToken;
          await handleSubmit(e, true);
        } else {
          setToast({
            message: "Could not refresh session.",
            type: "error",
          });
        }
      } else {
        setToast({
          message: dataresponse.message || "Organization creation failed",
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
      <div className="create-organization-container">
        <div className="create-organization-form-wrapper">
          <header style={{ cursor: "not-allowed", opacity: 0.5 }}>
            <FaArrowLeft className="create-organization-back-icon" />
            <h6 className="create-organization-title">
              Please complete creation
            </h6>
          </header>

          <h2 style={{ color: "#333333", textAlign: "center" }}>
            Create Organization
          </h2>
          <form className="create-organization-form" onSubmit={handleSubmit}>
            <label>
              Organization Name
              <input
                type="text"
                name="name"
                placeholder="Ex: ABC Inc."
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Industry
              <input
                type="text"
                name="industry"
                placeholder="Ex: Software"
                value={formData.industry}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Size Range
              <select
                name="sizeRange"
                value={formData.sizeRange}
                onChange={handleChange}
                required
              >
                <option value="">Select Size Range</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="501-1000">501-1000</option>
                <option value="1000+">1000+</option>
              </select>
            </label>

            <label>
              Contact Email
              <input
                type="email"
                name="contactEmail"
                placeholder="Enter your contact email"
                value={formData.contactEmail}
                onChange={handleChange}
              />
            </label>
            <label>
              orgOwnerId
              <input
                type="text"
                name="orgOwnerId"
                placeholder="Enter your orgOwnerId"
                value={formData.orgOwnerId}
                onChange={handleChange}
              />
            </label>

            <button type="submit" className="create-organization-button">
              Create Organization
            </button>
          </form>
          <JoinOrganizationButton
            setToast={setToast}
            setIsLoading={setIsLoading}
          />
        </div>
      </div>
    </>
  );
};

export default CreateOrganization;
