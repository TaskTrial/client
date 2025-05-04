import AccessToken from "../auth/AccessToken";
import { setDepartment } from "../store/departmentSlice";

export const fetchDepartmentDetails = async ({
  userData,
  departmentId,
  setToast,
  setIsLoading,
  dispatch,
  navigate,
  retried = false,
}) => {
  const Access = localStorage.getItem("accessToken");
  const orgId = await userData.organization?.id;

  if (!Access || !orgId || !departmentId) {
    setToast({
      message: "Missing data to fetch department details",
      type: "error",
    });
  }

  setIsLoading(true);

  try {
    const response = await fetch(
      `http://localhost:3000/api/organizations/${orgId}/departments/${departmentId}`,
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
      dispatch(setDepartment(data));
      //       const existingOrgData =
      //         JSON.parse(localStorage.getItem("dataOrganization")) || {};
      //       const updatedOrgData = {
      //         ...existingOrgData,
      //         ...data.data,
      //       };
      //       localStorage.setItem("dataOrganization", JSON.stringify(updatedOrgData));
      setToast({
        message: data.message || "Department loaded successfully",
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

        await fetchDepartmentDetails({
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
        message: data.message || "Failed to fetch department",
        type: "error",
      });
    }
  } catch (err) {
    setToast({ message: err.message, type: "error" });
  } finally {
    setIsLoading(false);
  }
};
