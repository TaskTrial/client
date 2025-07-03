// src/projects/fetchProjectDetails.js
import AccessToken from "../auth/AccessToken";
import { projectDetails } from "../store/projectSlice";

export const fetchProjectDetails = async ({
  userData,
  teamId,
  projectId,
  setToast,
  setIsLoading,
  dispatch,
  navigate,
  retried = false,
}) => {
  const token = localStorage.getItem("accessToken");
  const orgId = localStorage.getItem("orgId");
  if (!token || !orgId || !projectId) {
    setToast({
      message: "Missing data to fetch project details",
      type: "error",
    });
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch(
      `http://localhost:3000/api/organization/${orgId}/team/${teamId}/project/${projectId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      dispatch(projectDetails(data));
      setToast({ message: data.message || "Project loaded", type: "success" });
    } else if (data.message === "Token expired" && !retried) {
      const newToken = await AccessToken({
        userData,
        dispatch,
        navigate,
        setToast,
      });

      if (newToken) {
        localStorage.setItem("accessToken", newToken);
        await fetchProjectDetails({
          userData,
          teamId,
          projectId,
          setToast,
          setIsLoading,
          dispatch,
          navigate,
          retried: true,
        });
      }
    } else {
      setToast({
        message: data.message || "Failed to load project",
        type: "error",
      });
    }
  } catch (err) {
    setToast({ message: err.message, type: "error" });
  } finally {
    setIsLoading(false);
  }
};
