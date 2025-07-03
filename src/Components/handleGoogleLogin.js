// GoogleLoginButton.js
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase-config";

const handleGoogleLogin = async (setIsLoading, navigate, setToast) => {
  setIsLoading(true);

  try {
    // login from google
    const result = await signInWithPopup(auth, provider);
    const credential = result._tokenResponse;

    //   const credential = result.credential;
    //   const token = credential.accessToken;
    //   const user = result.user;
    if (!credential?.idToken) {
      setToast("No ID token found from Google");
      setIsLoading(false);
      return;
    }
    const idToken = credential.idToken;

    console.log("Google ID Token:", idToken);

    const response = await fetch("http://localhost:3000/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    const data = await response.json();

    if (response.ok) {
      setIsLoading(false);
      console.log("Login Success:", data);
      setToast({
        message: `welcome ${data.user.name}`,
        type: "success",
      });

      // routing to anther page or store data in localstorage
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("user", JSON.stringify(data.user));

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      navigate("/Home");
    } else {
      setToast({
        message: "login failed:" + data.message,
        type: "error",
      });
    }
  } catch (error) {
    if (error.code === "auth/popup-closed-by-user") {
      setToast({
        message: "Login canceled by user.",
        type: "error",
      });
    } else {
      setToast({
        message: error.message || "An error occurred while logging in",
        type: "error",
      });
    }
  } finally {
    setIsLoading(false);
  }
};

export default handleGoogleLogin;
