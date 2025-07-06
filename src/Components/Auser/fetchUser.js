import AccessToken from "../auth/AccessToken";
import { getUser } from "../store/userSlice";

export const fetchUser = async ({
  userData,
  dispatch,
  navigate,
  setToast,
  setIsLoading,
  retried = false,
}) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!userData?.id || !userData?.accessToken) {
    setToast({
      message: "User not found",
      type: "error",
    });
    setTimeout(() => {
      navigate("/SignIn");
    }, 1500);
    return;
  }

  const userId = localStorage.getItem("userId") || userData.id;
  setIsLoading(true);
  console.log(userId, "tgtyhyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
  try {
    const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      localStorage.setItem("getUser", JSON.stringify(data.user));
      localStorage.setItem("orgId", data.user.organization.id);
      dispatch(
        getUser({
          user: {
            ...data.user,
            id: userData.id,
            email: userData.email,
            role: userData.role,
          },
        })
      );
      setToast({
        message: data.message || "Data get successfully",
        type: "success",
      });
      // return data.user?.organization?.id;
    } else if (data.message === "Token expired" && !retried) {
      const newAccessToken = await AccessToken({
        refreshToken: userData.refreshToken,
        userData,
        dispatch,
        navigate,
        setToast,
      });

      if (newAccessToken) {
        userData.accessToken = newAccessToken;
        localStorage.setItem("accessToken", newAccessToken);
        return await fetchUser({
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
      setToast({ message: data.message, type: "error" });
    }
  } catch (error) {
    setToast({ message: error.message, type: "error" });
    console.error(error.message);
  } finally {
    setIsLoading(false);
  }
};
