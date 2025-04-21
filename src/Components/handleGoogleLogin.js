// GoogleLoginButton.js
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase-config";

const handleGoogleLogin = async (setIsLoading, navigate) => {
  setIsLoading(true);

  try {
    // login from google
    const result = await signInWithPopup(auth, provider);
    const credential = result._tokenResponse;

    //   const credential = result.credential;
    //   const token = credential.accessToken;
    //   const user = result.user;
    if (!credential?.idToken) {
      alert("No ID token found from Google");
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
      alert(`welcome ${data.user.name}`);
      // routing to anther page or store data in localstorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("accessToken", data.tokens.accessToken);
      localStorage.setItem("refreshToken", data.tokens.refreshToken);
      navigate("/SignIn");
      alert("please sign before access to your account");
    } else {
      alert("login failed:" + data.message);
    }
  } catch (error) {
    console.error("Google login error:", error);
    if (error.code === "auth/popup-closed-by-user") {
      alert("Login canceled by user.");
    } else {
      console.error("Google login error:", error.message);
      alert("An error occurred while logging in");
    }
  } finally {
    setIsLoading(false);
  }
};

export default handleGoogleLogin;
