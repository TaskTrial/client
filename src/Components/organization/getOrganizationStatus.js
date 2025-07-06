import AccessToken from "../auth/AccessToken";
import { setOrganization } from "../store/organizationSlice";

export async function getOrganizationStatus({
  userData,
  dispatch,
  navigate,
  setIsLoading,
  setToast,
  retried = false,
}) {
  const accessToken = localStorage.getItem("accessToken");

  try {
    setIsLoading(true);
    const response = await fetch(
      "http://localhost:3000/api/organization/status",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("orgId", data.organization.id);

      dispatch(setOrganization(data));
      const existingOrgData =
        JSON.parse(localStorage.getItem("dataOrganization")) || {};
      const updatedOrgData = {
        ...existingOrgData,
        ...data.organization,
      };
      localStorage.setItem("dataOrganization", JSON.stringify(updatedOrgData));
      return data.organization.id;
    } else if (data.message === "Token expired" && !retried) {
      const newAccessToken = await AccessToken({
        userData,
        dispatch,
        navigate,
        setToast,
      });

      if (newAccessToken) {
        userData.accessToken = newAccessToken;
        localStorage.setItem("accessToken", newAccessToken);
        return await getOrganizationStatus({
          userData,
          dispatch,
          navigate,
          setToast,
          setIsLoading,
          retried: true,
          tokenOverride: newAccessToken,
        });
      } else {
        setToast({
          message: "Could not refresh session.",
          type: "error",
        });
      }
    } else {
      setToast({
        type: "error",
        message: data.message || "Failed to fetch organization status",
      });
      return null;
    }
  } catch (error) {
    setToast({
      type: "error",
      message: `"Error fetching organization status" ${error}`,
    });
    return null;
  } finally {
    setIsLoading(false);
  }
}
