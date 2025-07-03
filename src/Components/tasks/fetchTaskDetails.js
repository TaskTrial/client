// src/tasks/fetchTaskDetails.js
import AccessToken from "../auth/AccessToken";
import { taskDetails } from "../store/taskSlice";
export const fetchTaskDetails = async ({
  userData,
  taskId,
  projectId,
  teamId,
  setToast,
  setIsLoading,
  dispatch,
  navigate,
  retried = false,
}) => {
  const orgId = localStorage.getItem("orgId");
  const token = localStorage.getItem("accessToken");
  if (!taskId || !projectId || !teamId || !orgId || !token) {
    setToast({ message: "Missing task info", type: "error" });
    return;
  }

  setIsLoading(true);
  try {
    const response = await fetch(
      `http://localhost:3000/api/organization/${orgId}/team/${teamId}/project/${projectId}/task/${taskId}`,
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
      dispatch(taskDetails(data));
      setToast({ message: data.message || "task loaded", type: "success" });
    } else if (data.message === "Token expired" && !retried) {
      const newToken = await AccessToken({
        userData,
        dispatch,
        navigate,
        setToast,
      });

      if (newToken) {
        localStorage.setItem("accessToken", newToken);
        await fetchTaskDetails({
          userData,
          taskId,
          projectId,
          teamId,
          setToast,
          setIsLoading,
          dispatch,
          navigate,
          retried: true,
        });
      }
    } else {
      setToast({
        message: data.message || "Failed to fetch task",
        type: "error",
      });
    }
  } catch (err) {
    setToast({ message: err.message, type: "error" });
  } finally {
    setIsLoading(false);
  }
};
