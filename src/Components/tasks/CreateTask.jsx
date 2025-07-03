import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Toast from "../Toast";
import AccessToken from "../auth/AccessToken";
import LoadingOverlay from "../LoadingOverlay";
import { useNavigate } from "react-router-dom";
import { fetchTeamDetails } from "../teams/fetchTeamDetails";
import { fetchProjectDetails } from "../projects/fetchProjectDetails";
import "../Styles/CreateTask.css";
import { useLocation } from "react-router-dom";
import { FaArrowLeft, FaTasks } from "react-icons/fa";
const CreateTask = () => {
  const location = useLocation();

  const propTeamId = location.state?.teamId || "";
  const propProjectId = location.state?.projectId || "";
  const isFromProjectDetails =
    location.state?.from === "ProjectDetails" &&
    location.state?.teamId &&
    location.state?.projectId;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const organizationId = localStorage.getItem("orgId");

  const teams = useSelector((state) => state.organization.teams);
  const project = useSelector((state) => state.project);

  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [teamId, setTeamId] = useState(propTeamId);
  const [projectId, setProjectId] = useState(propProjectId);
  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    assignedTo: "",
    dueDate: "",
    estimatedTime: 0,
    labels: "",
  });

  const projectMembers = propProjectId
    ? project?.members || []
    : project.members;
  console.log(projectMembers);
  useEffect(() => {
    const getTeamProjects = async () => {
      if (!teamId || propProjectId) return;

      await fetchTeamDetails({
        userData,
        teamId: teamId,
        dispatch,
        navigate,
        setToast,
        setIsLoading,
        onSuccess: (data) => {
          setProjects(data.data?.projects || []);
        },
      });
    };

    getTeamProjects();
  }, [teamId, dispatch, navigate, propProjectId, userData]);

  useEffect(() => {
    const getProjectMembers = async () => {
      if (!projectId || projectMembers.length) return;

      await fetchProjectDetails({
        userData,
        projectId: projectId,
        teamId: teamId,
        dispatch,
        navigate,
        setToast,
        setIsLoading,
      });
    };

    getProjectMembers();
  }, [
    projectId,
    teamId,
    dispatch,
    navigate,
    propProjectId,
    userData,
    projectMembers.length,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "estimatedTime" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e, retried = false) => {
    e.preventDefault();
    if (!projectId) {
      return setToast({ message: "Please select a project", type: "error" });
    }

    const payload = {
      ...formData,
      labels: formData.labels
        .split(",")
        .map((l) => l.trim())
        .filter((l) => l),
    };

    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:3000/api/organization/${organizationId}/team/${teamId}/project/${projectId}/task/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setToast({ message: data.message || "Task created", type: "success" });
        setFormData({
          title: "",
          description: "",
          priority: "MEDIUM",
          assignedTo: "",
          dueDate: "",
          estimatedTime: 0,
          labels: "",
        });

        if (!propProjectId) {
          setTimeout(() => navigate("/Home"), 1500);
        }
        if (propProjectId) {
          setTimeout(() => navigate(`/Home/Projects/${propProjectId}`), 1500);
        }
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
        setToast({
          message: data.message || "Task creation failed",
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
    <div className="createtask-container">
      <LoadingOverlay isLoading={isLoading} />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <header
        className="createtask-header"
        onClick={() => {
          const from = location.state?.from;
          if (from === "ProjectDetails" && propProjectId) {
            navigate(`/Home/Projects/${propProjectId}`);
          } else {
            navigate("/Home");
          }
        }}
      >
        <FaArrowLeft className="createtask-back-icon" />
        <h6>Back</h6>
      </header>

      <h2>
        <FaTasks className="createtask-task-icon" /> Create Task
      </h2>

      <form className="createtask-form" onSubmit={handleSubmit}>
        {!isFromProjectDetails && (
          <label>
            Select Team:
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              required
            >
              <option value="">-- Select Team --</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {!propProjectId && (
          <label>
            Select Project:
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
            >
              <option value="">-- Select Project --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            required
            onChange={handleChange}
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>

        <label>
          Priority:
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </label>

        <label>
          Assign To:
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
          >
            <option value="">-- Select Member --</option>
            {projectMembers
              .filter((m) => m.role !== "PROJECT_OWNER")
              .map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.user.firstName} {m.user.lastName}
                </option>
              ))}
          </select>
        </label>

        <label>
          Due Date:
          <input
            type="datetime-local"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </label>

        <label>
          Estimated Time (hrs):
          <input
            type="number"
            name="estimatedTime"
            value={formData.estimatedTime}
            onChange={handleChange}
          />
        </label>

        <label>
          Labels (comma-separated):
          <input
            type="text"
            name="labels"
            value={formData.labels}
            onChange={handleChange}
          />
        </label>

        <button type="submit" disabled={isLoading}>
          Create Task
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
