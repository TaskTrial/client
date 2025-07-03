import AccessToken from "../auth/AccessToken";
import { setProjects } from "../store/projectSlice";

export const fetchProjects = async ({
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
    setToast({ message: "No organization info found", type: "error" });
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch(
      `http://localhost:3000/api/organization/${orgId}/projects`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const dataresponse = await response.json();

    if (response.ok) {
      dispatch(setProjects(dataresponse));
      setToast({
        message: dataresponse.message || "Projects loaded successfully",
        type: "success",
      });
    } else if (dataresponse.message === "Token expired" && !retried) {
      const newToken = await AccessToken({
        userData,
        dispatch,
        navigate,
        setToast,
      });

      if (newToken) {
        userData.accessToken = newToken;
        localStorage.setItem("accessToken", newToken);

        await fetchProjects({
          userData,
          setToast,
          setIsLoading,
          dispatch,
          navigate,
          retried: true,
        });
      } else {
        setToast({
          message:
            "You do not have any organization. Please create or join one.",
          type: "error",
        });
      }
    } else {
      setToast({
        message: dataresponse.message || "Failed to fetch projects",
        type: "error",
      });
    }
  } catch (err) {
    setToast({ message: err.message, type: "error" });
  } finally {
    setIsLoading(false);
  }
};
