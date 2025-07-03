/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useContext } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import googleAuthService from "./googleAuthService";

// Create the context
const GoogleAuthContext = createContext(null);

// Google Auth Provider component
export const GoogleAuthProvider = ({ children, clientId }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication state on mount
  useEffect(() => {
    const isAuth = googleAuthService.isAuthenticated();
    const currentUser = googleAuthService.getCurrentUser();
    setIsAuthenticated(isAuth);
    setUser(currentUser);
    setLoading(false);
  }, []);

  // Handle successful login
  const handleLoginSuccess = (result) => {
    setUser(result.user);
    setIsAuthenticated(true);
    return result;
  };

  // Logout function
  const handleLogout = async () => {
    await googleAuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Manual auth state updater (used after login with popup)
  const updateAuthState = () => {
    const isAuth = googleAuthService.isAuthenticated();
    const currentUser = googleAuthService.getCurrentUser();
    setIsAuthenticated(isAuth);
    setUser(currentUser);
  };

  // Provide all context values
  const contextValue = {
    user,
    isAuthenticated,
    loading,
    updateAuthState,
    login: async (idToken) => {
      const result = await googleAuthService.loginWithGoogle(idToken);
      return handleLoginSuccess(result);
    },
    logout: handleLogout,
  };

  return (
    <GoogleOAuthProvider
      clientId={clientId}
      onScriptLoadError={() => {
        console.error("Google OAuth script failed to load.");
      }}
    >
      <GoogleAuthContext.Provider value={contextValue}>
        {children}
      </GoogleAuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

// Custom hook to use the auth context
export const useGoogleAuth = () => {
  const context = useContext(GoogleAuthContext);
  if (!context) {
    throw new Error("useGoogleAuth must be used within a GoogleAuthProvider");
  }
  return context;
};

export default GoogleAuthContext;
