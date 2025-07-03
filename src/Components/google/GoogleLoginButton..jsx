/* eslint-disable react/prop-types */
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import googleAuthService from "./googleAuthService";
import { useGoogleAuth } from "./GoogleAuthContext";
import googlePicture from "../../assets/google.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Google Login Button Component (custom)
 *
 * @param {Object} props
 * @param {Function} props.onSuccess
 * @param {Function} props.onError
 * @param {string} props.text
 * @param {boolean} props.disabled
 */
const GoogleLoginButton = ({
  onSuccess,
  onError,
  text = "Sign in with Google",
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { updateAuthState } = useGoogleAuth();

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setIsLoading(true);
      setError(null);

      try {
        if (codeResponse.code) {
          const response = await fetch(`${API_URL}/api/auth/google/callback`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: codeResponse.code }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Authentication failed");
          }

          // Save tokens and user
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          localStorage.setItem("user", JSON.stringify(data.user));

          updateAuthState();
          if (onSuccess) onSuccess(data);
        } else if (codeResponse.access_token) {
          const result = await googleAuthService.loginWithGoogle(
            codeResponse.access_token
          );
          updateAuthState();
          if (onSuccess) onSuccess(result);
        }
      } catch (err) {
        setError(err.message);
        if (onError) onError(err);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (err) => {
      setError("Google login failed");
      if (onError) onError(err);
    },
    flow: "auth-code",
    ux_mode: "popup",
    redirect_uri: "postmessage",
    scope: "email profile openid",
    select_account: true,
  });

  return (
    <div>
      <button
        className="Signgoogle-btn"
        onClick={login}
        disabled={disabled || isLoading}
      >
        <img
          src={googlePicture}
          width="20px"
          height="20px"
          alt="googlePicture"
        />
        {isLoading ? "Loading..." : text}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error || "Authentication failed. Try again."}
        </p>
      )}
    </div>
  );
};

export default GoogleLoginButton;
