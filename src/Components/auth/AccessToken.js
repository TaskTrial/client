//AccessToken.js

import { login } from "../store/userSlice";
const AccessToken = async ({
  refreshToken,
  userData,
  dispatch,
  navigate,
  setToast,
}) => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/auth/refreshAccessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );
    const refreshData = await response.json();
    if (response.ok) {
      localStorage.setItem("accessToken", refreshData.accessToken);
      localStorage.setItem("auth", "true");
      console.log(`1-${refreshData.message}`);
      // setToast({
      //   message: refreshData.message || "accessToken get successfully",
      //   type: "success",
      // });
      dispatch(
        login({
          user: {
            id: userData.id,
            email: userData.email,
            role: userData.role,
          },
          accessToken: refreshData.accessToken,
          refreshToken: userData.refreshToken,
        })
      );
      return refreshData.accessToken;
    } else {
      // refreshToken expired 403
      // localStorage.clear(); after fix refreshtoken
      console.log(`2-${refreshData.message}`);
      setToast({
        message:
          refreshData.mssage || "refreshToken is expired please login again",
        type: "error",
      });
      navigate("/SignIn");
      return null;
    }
  } catch (error) {
    setToast({ message: error.message, type: "error" });
    console.log(`3-${error.message}`);
    return null;
  }
};

export default AccessToken;
