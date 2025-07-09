import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import "../Styles/EditOrganization.css";
import Toast from "../Toast";
import { useNavigate } from "react-router-dom";
import AccessToken from "../auth/AccessToken";
import LoadingOverlay from "../LoadingOverlay";
import OrganizationImageUploader from "./OrganizationImageUploader";
///////
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setOrganization } from "../store/organizationSlice";
const EditOrganization = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const org = useSelector((state) => state.organization);
  const navigate = useNavigate();

  const [formDataState, setFormDataState] = useState({
    name: org.name || "",
    industry: org.industry || "",
    description: org.description || "",
    contactEmail: org.contactEmail || "",
    contactPhone: org.contactPhone || "",
    address: org.address || "",
    website: org.website || "",
    orgOwnerId: org.orgOwnerId || "",
  });

  const handleInputChange = (e) => {
    setFormDataState({ ...formDataState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, retried = false) => {
    e.preventDefault();
    setIsLoading(true);
    const orgId = userData.organization.id;
    const accessToken = localStorage.getItem("accessToken");
    const formatWebsite = (url) => {
      const trimmed = url.trim().toLowerCase();
      if (!trimmed) return "";
      if (!/^https?:\/\//i.test(trimmed)) {
        return `https://${trimmed}`;
      }
      return trimmed;
    };
    const beforepayload = {
      name: formDataState.name.toLowerCase().trim(),
      industry: formDataState.industry.toLowerCase().trim(),
      description: formDataState.description.toLowerCase().trim(),
      contactEmail: formDataState.contactEmail.toLowerCase().trim(),
      contactPhone: formDataState.contactPhone.toLowerCase().trim(),
      address: formDataState.address.toLowerCase().trim(),
      website: formatWebsite(formDataState.website),
      orgOwnerId: formDataState.orgOwnerId.trim(),
    };
    const payload = Object.fromEntries(
      Object.entries(beforepayload).filter(([, value]) => value !== "")
    );
    //  console.log("Payload to send:", payload);
    try {
      const response = await fetch(
        `http://localhost:3000/api/organization/${orgId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const dataresponse = await response.json();
      if (response.ok) {
        dispatch(setOrganization(dataresponse)); //not essential
        const existingOrgData =
          JSON.parse(localStorage.getItem("dataOrganization")) || {};
        const updatedOrgData = {
          ...existingOrgData,
          ...dataresponse.data,
        };
        localStorage.setItem(
          "dataOrganization",
          JSON.stringify(updatedOrgData)
        );
        setToast({
          message: dataresponse.message || "Data saved successfully",
          type: "success",
        });
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
        console.log("from editorg");
        console.log(dataresponse);
        setToast({
          message: dataresponse.message || "An error occurred while saving.",
          type: "error",
        });
      }
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  const backToHome = () => {
    navigate("/Home");
  };
  return (
    <div className="editOrganization-container">
      <LoadingOverlay isLoading={isLoading} />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <header className="editOrganization-header" onClick={backToHome}>
        <FaArrowLeft className="editOrganization-back-icon" />
        <h6 className="editOrganization-title">My Organization</h6>
      </header>
      <h1 className="editOrganization-top">EditOrganization</h1>
      <OrganizationImageUploader
        OrganizationPicFromApi={org.logoUrl}
        setToast={setToast}
        setIsLoading={setIsLoading}
        onUploadSuccess={(updatedOrganization) =>
          dispatch(setOrganization(updatedOrganization))
        }
      />
      <form className="editOrganization-form" onSubmit={handleSubmit}>
        <label>
          <input
            name="name"
            value={formDataState.name}
            onChange={handleInputChange}
            type="text"
            placeholder="TaskTrial"
          />
        </label>

        <label>
          industry
          <input
            name="industry"
            value={formDataState.industry}
            onChange={handleInputChange}
            type="text"
            placeholder="Software"
          />
        </label>

        <label>
          organization description
          <input
            name="description"
            value={formDataState.description}
            onChange={handleInputChange}
            type="text"
            placeholder="organization description"
          />
        </label>

        <label>
          contact Email
          <input
            name="contactEmail"
            value={formDataState.contactEmail}
            onChange={handleInputChange}
            type="text"
            placeholder="example@vfggt.com"
          />
        </label>

        <label>
          contact Phone
          <input
            name="contactPhone"
            value={formDataState.contactPhone}
            onChange={handleInputChange}
            placeholder="0134566778"
          />
        </label>
        <label>
          Address
          <input
            name="address"
            value={formDataState.address}
            onChange={handleInputChange}
            placeholder="please enter adress"
          />
        </label>
        <label>
          website
          <input
            name="website"
            value={formDataState.website}
            onChange={handleInputChange}
            placeholder="website"
          />
        </label>
        <label>
          orgOwnerId
          <input
            name="orgOwnerId"
            value={formDataState.orgOwnerId}
            onChange={handleInputChange}
            placeholder="Enter owner id"
          />
        </label>

        <button type="submit" className="editOrganization-save-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditOrganization;
