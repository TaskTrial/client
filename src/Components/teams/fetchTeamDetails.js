import AccessToken from "../auth/AccessToken";
import { setTeam } from "../store/teamSlice";

export const fetchTeamDetails = async ({
  userData,
  TeamId,
  setToast,
  setIsLoading,
  dispatch,
  navigate,
  retried = false,
}) => {
  const Access = localStorage.getItem("accessToken");
  const orgId = await userData.organization?.id;

  if (!Access || !orgId || !TeamId) {
    setToast({
      message: "Missing data to fetch department details",
      type: "error",
    });
  }

  setIsLoading(true);

  try {
    const response = await fetch(
      `http://localhost:3000/api/organization/${orgId}/Teams/${TeamId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Access}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      dispatch(setTeam(data));
      console.log(data);
      setToast({
        message: data.message || "Team loaded successfully",
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
        userData.accessToken = newToken;
        localStorage.setItem("accessToken", newToken);

        await fetchTeamDetails({
          userData,
          setToast,
          setIsLoading,
          navigate,
          retried: true,
        });
      } else {
        setToast({
          message: "Token expired. Please login again",
          type: "error",
        });
      }
    } else {
      setToast({
        message: data.message || "Failed to fetch Team",
        type: "error",
      });
    }
  } catch (err) {
    setToast({ message: err.message, type: "error" });
  } finally {
    setIsLoading(false);
  }
};
