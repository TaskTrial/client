/* eslint-disable react/prop-types */
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import googleAuthService from "./googleAuthService";
import { useGoogleAuth } from "./GoogleAuthContext";
import googlePicture from "../../assets/google.png";

/**
 * Google Login Button Component
 *
 * @param {Object} props
 * @param {Function} props.onSuccess - Callback on successful login
 * @param {Function} props.onError - Callback on login error
 * @param {string} props.text - Button text
 * @param {boolean} props.disabled - Disable button
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
    onSuccess: async (response) => {
      setIsLoading(true);
      setError(null);

      try {
        let result;

        if (response.access_token) {
          result = await googleAuthService.loginWithGoogle(
            response.access_token
          );
        } else if (response.code) {
          result = await googleAuthService.exchangeCodeForTokens(response.code);
        } else {
          throw new Error("No valid authentication data from Google");
        }

        updateAuthState();
        if (onSuccess) onSuccess(result);
      } catch (err) {
        setError(err.message || "Authentication failed");
        if (onError) onError(err);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (err) => {
      setError("Google login failed");
      if (onError) onError(err);
    },
    flow: "implicit",
    ux_mode: "popup",
    redirect_uri: "postmessage",
    scope: "email profile openid",
    select_account: true,
  });

  return (
    <div>
      <button
        className="Signgoogle-btn"
        onClick={() => {
          setError(null);
          login();
        }}
        disabled={disabled || isLoading}
      >
        <img src={googlePicture} width="20px" height="20px" alt="Google" />
        {isLoading ? "Loading..." : text}
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default GoogleLoginButton;
