import AccessToken from "../auth/AccessToken";
import { setOrganization } from "../store/organizationSlice";

export const fetchOrganization = async ({
  userData,
  orgId,
  setToast,
  setIsLoading,
  dispatch,
  navigate,
  retried = false,
}) => {
  const Access = localStorage.getItem("accessToken");

  if (!Access || !orgId) {
    setToast({ message: "No organization info found", type: "error" });
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch(
      `http://localhost:3000/api/organization/${orgId}`,
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
      // dispatch && dispatch({ type: "organization/set", payload: dataresponse });
      dispatch(setOrganization(dataresponse)); //not essential
      const existingOrgData =
        JSON.parse(localStorage.getItem("dataOrganization")) || {};
      const updatedOrgData = {
        ...existingOrgData,
        ...dataresponse.data,
      };
      localStorage.setItem("dataOrganization", JSON.stringify(updatedOrgData));
      setToast({
        message: dataresponse.message || "Organization loaded successfully",
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
        await fetchOrganization({
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
            "you do not have any organization please create or join to organization",
          type: "error",
        });
      }
    } else {
      setToast({
        message: "please create or join to organization first",
        type: "error",
      });
    }
  } catch (err) {
    setToast({ message: err.message, type: "error" });
  } finally {
    setIsLoading(false);
  }
};
