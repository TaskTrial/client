import AccessToken from "../auth/AccessToken";
import { setDepartment } from "../store/departmentSlice";

export const fetchDepartments = async ({
  userData,
  setToast,
  setIsLoading,
  dispatch,
  navigate,
  retried = false,
}) => {
  const Access = localStorage.getItem("accessToken");
  const orgId = await userData.organization?.id;

  if (!Access || !orgId) {
    setToast({ message: "No organization info found", type: "error" });
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch(
      `http://localhost:3000/api/organizations/${orgId}/departments/all`,
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
      dispatch(setDepartment(dataresponse));
      // dispatch(setOrganization(dataresponse)); //not essential
      // const existingOrgData =
      //   JSON.parse(localStorage.getItem("dataOrganization")) || {};
      // const updatedOrgData = {
      //   ...existingOrgData,
      //   ...dataresponse.data,
      // };
      // localStorage.setItem("dataOrganization", JSON.stringify(updatedOrgData));
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

        await fetchDepartments({
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
