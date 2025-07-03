import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingOverlay from "../LoadingOverlay";
import Toast from "../Toast";
import { FaArrowLeft } from "react-icons/fa";
import AccessToken from "../auth/AccessToken";
import "../Styles/EditProject.css";
import ProjectStatusUpdater from "./ProjectStatusUpdater";
import ProjectPriorityUpdater from "./ProjectPriorityUpdater";
import AddProjectMembers from "./AddProjectMembers";
import RemoveProjectMember from "./RemoveProjectMember";
const EditProject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const team = useSelector((state) => state.team);
  const teamId = team.team.id;
  const project = useSelector((state) => state.project);
  const orgId = localStorage.getItem("orgId");

  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "",
    startDate: "",
    endDate: "",
    priority: "",
    budget: "",
    progress: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const budgetValue = formData.budget.trim();
  const progressValue = formData.progress.trim();

  if (budgetValue !== "") {
    const parsedBudget = parseFloat(budgetValue);
    if (isNaN(parsedBudget) || parsedBudget < 0) {
      return setToast({
        message: "Budget must be a non-negative number.",
        type: "error",
      });
    }
  }

  if (progressValue !== "") {
    const parsedProgress = parseFloat(progressValue);
    if (isNaN(parsedProgress) || parsedProgress < 0 || parsedProgress > 100) {
      return setToast({
        message: "Progress must be between 0 and 100.",
        type: "error",
      });
    }
  }
  const beforepayload = {
    name: formData.name.trim(),
    description: formData.description.trim(),
    status: formData.status.trim(),
    startDate: formData.startDate.trim(),
    endDate: formData.endDate.trim(),
    priority: formData.priority.trim(),
    budget: budgetValue !== "" ? parseFloat(budgetValue) : "",
    progress:
      progressValue !== ""
        ? Math.min(100, Math.max(0, parseFloat(progressValue)))
        : "",
  };
  const handleSubmit = async (e, retried = false) => {
    e.preventDefault();
    const payload = Object.fromEntries(
      Object.entries(beforepayload).filter(([, v]) => v !== "")
    );

    if (Object.keys(payload).length === 0) {
      return setToast({
        message: "Please enter data to update the project.",
        type: "error",
      });
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      console.log(project.id, "from editpro");
      const response = await fetch(
        `http://localhost:3000/api/organization/${orgId}/team/${teamId}/project/${project.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setToast({
          message: data.message || "Project updated",
          type: "success",
        });
      } else if (data.message === "Token expired" && !retried) {
        const newToken = await AccessToken({
          userData,
          dispatch,
          navigate,
          setToast,
        });
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          await handleSubmit(e, true);
        }
      } else {
        setToast({ message: data.message || "Update failed", type: "error" });
      }
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="updateproject-container">
      <LoadingOverlay isLoading={isLoading} />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <header className="updateproject-header" onClick={() => navigate(-1)}>
        <FaArrowLeft className="updateproject-back-icon" />
        <h6 className="updateproject-title">Back</h6>
      </header>
      <h2 className="updateproject-heading">Update Project</h2>
      <form className="updateproject-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            maxLength="200"
          />
        </label>

        <label>
          Status
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="">--Select--</option>
            <option value="PLANNING">Planning</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </label>

        <label>
          Start Date
          <input
            name="startDate"
            type="datetime-local"
            value={formData.startDate}
            onChange={handleChange}
          />
        </label>

        <label>
          End Date
          <input
            name="endDate"
            type="datetime-local"
            value={formData.endDate}
            onChange={handleChange}
          />
        </label>

        <label>
          Priority
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="">--Select--</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </label>

        <label>
          Budget
          <input
            name="budget"
            type="number"
            value={formData.budget}
            onChange={handleChange}
          />
        </label>

        <label>
          Progress (%)
          <input
            name="progress"
            type="number"
            max="100"
            min="0"
            value={formData.progress}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="updateproject-save-button">
          Update
        </button>
      </form>
      <h3 style={{ color: "#555", textAlign: "center", marginBlock: "10px" }}>
        another services :fast action
      </h3>
      <ProjectStatusUpdater projectId={project.id} />
      <ProjectPriorityUpdater projectId={project.id} />
      <AddProjectMembers
        projectId={project.id}
        teamId={teamId}
        setToast={setToast}
        setIsLoading={setIsLoading}
      />
      <RemoveProjectMember
        projectId={project.id}
        teamId={teamId}
        setToast={setToast}
        setIsLoading={setIsLoading}
      />
    </div>
  );
};

export default EditProject;
