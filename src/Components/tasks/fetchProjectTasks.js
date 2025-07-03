import { setTasks } from "../store/taskSlice";
import AccessToken from "../auth/AccessToken";

export const fetchProjectTasks = async ({
  userData,
  teamId,
  projectId,
  setToast,
  setIsLoading,
  dispatch,
  navigate,
  retried = false,
}) => {
  try {
    setIsLoading(true);
    const orgId = localStorage.getItem("orgId");
    const token = localStorage.getItem("accessToken");

    const response = await fetch(
      `http://localhost:3000/api/organization/${orgId}/team/${teamId}/project/${projectId}/task/all`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      dispatch(setTasks({ tasks: data.tasks, pagination: data.pagination }));
    } else if (data.message === "Token expired" && !retried) {
      const newToken = await AccessToken({
        userData,
        dispatch,
        navigate,
        setToast,
      });

      if (newToken) {
        localStorage.setItem("accessToken", newToken);
        await fetchProjectTasks({
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
        message: data.message || "Failed to fetch tasks",
        type: "error",
      });
    }
  } catch (error) {
    setToast({ message: error.message, type: "error" });
  } finally {
    setIsLoading(false);
  }
};
