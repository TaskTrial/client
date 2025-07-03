// src/team/fetchTeamProjects.js
import AccessToken from "../auth/AccessToken";
import { setTeamProjects } from "../store/projectSlice";

export const fetchTeamProjects = async ({
  teamId,
  userData,
  setToast,
  setIsLoading,
  dispatch,
  navigate,
  retried = false,
}) => {
  const token = localStorage.getItem("accessToken");
  const orgId = localStorage.getItem("orgId");

  if (!token || !orgId || !teamId) {
    setToast({
      message: "Missing data to fetch team projects",
      type: "error",
    });
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch(
      `http://localhost:3000/api/organization/${orgId}/team/${teamId}/project/all`,
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
      dispatch(setTeamProjects(data));
      setToast({ message: "Team projects loaded", type: "success" });
    } else if (data.message === "Token expired" && !retried) {
      const newToken = await AccessToken({
        userData,
        dispatch,
        navigate,
        setToast,
      });

      if (newToken) {
        localStorage.setItem("accessToken", newToken);
        await fetchTeamProjects({
          teamId,
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
        message: data.message || "Failed to load projects",
        type: "error",
      });
    }
  } catch (err) {
    setToast({ message: err.message, type: "error" });
  } finally {
    setIsLoading(false);
  }
};
