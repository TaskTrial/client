import AccessToken from "../auth/AccessToken";
import { setTasks } from "../store/taskSlice";

export const fetchTasks = async ({
  userData,
  setToast,
  setIsLoading,
  dispatch,
  navigate,
  retried = false,
}) => {
  const accessToken = localStorage.getItem("accessToken");
  const orgId = localStorage.getItem("orgId");

  if (!accessToken || !orgId) {
    setToast({ message: "No organization found", type: "error" });
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch(
      `http://localhost:3000/api/organization/${orgId}/tasks`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      dispatch(setTasks(data.data));
      setToast({
        message: data.message || "Tasks loaded successfully",
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
        userData.accessToken = newToken;
        await fetchTasks({
          userData,
          setToast,
          setIsLoading,
          dispatch,
          navigate,
          retried: true,
        });
      }
    } else {
      setToast({
        message: data.message || "Failed to fetch organization tasks",
        type: "error",
      });
    }
  } catch (err) {
    setToast({ message: err.message, type: "error" });
  } finally {
    setIsLoading(false);
  }
};
