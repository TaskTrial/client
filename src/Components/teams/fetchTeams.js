import AccessToken from "../auth/AccessToken";
import { setTeam } from "../store/teamSlice";

export const fetchTeams = async ({
  userData,
  setToast,
  setIsLoading,
  dispatch,
  navigate,
  retried = false,
}) => {
  const Access = localStorage.getItem("accessToken");
  const orgId = localStorage.getItem("orgId");
  if (!Access || !orgId) {
    setToast({ message: "No organization info found", type: "error" });
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch(
      `http://localhost:3000/api/organization/${orgId}/Teams/all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Access}`,
        },
      }
    );

    const dataresponse = await response.json();

    if (response.ok) {
      dispatch(setTeam(dataresponse));
      setToast({
        message: dataresponse.message || "Departments loaded successfully",
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

        await fetchTeams({
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
        message: dataresponse.message || "Failed to fetch departments",
        type: "error",
      });
    }
  } catch (err) {
    setToast({ message: err.message, type: "error" });
  } finally {
    setIsLoading(false);
  }
};
