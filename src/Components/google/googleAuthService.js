const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Service to handle Google OAuth authentication using fetch
 */
const googleAuthService = {
  /**
   * Send Google access token to backend for verification and login/signup
   * @param {string} access_token - The Google access token
   * @returns {Promise<Object>} user data and tokens
   */
  async loginWithGoogle(access_token) {
    if (!access_token) {
      throw new Error("Access token is required");
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ access_token }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Login failed with status ${response.status}`
        );
      }

      const { accessToken, refreshToken, user } = data;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("auth", "true");
        localStorage.setItem("userId", user.id);
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Exchange authorization code for tokens
   * @param {string} code - The authorization code from Google
   * @returns {Promise<Object>} user data and tokens
   */
  async exchangeCodeForTokens(code) {
    if (!code) {
      throw new Error("Authorization code is required");
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/google/callback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Code exchange failed with status ${response.status}`
        );
      }

      const { accessToken, refreshToken, user } = data;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("auth", "true");
        localStorage.setItem("userId", user.id);
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if user is authenticated with Google
   * @returns {boolean}
   */
  isAuthenticated() {
    return Boolean(localStorage.getItem("accessToken"));
  },

  /**
   * Get the current user from localStorage
   * @returns {Object|null}
   */
  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Logout the user by clearing localStorage and optionally notifying backend
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
      });
    } catch (error) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("auth");
      localStorage.removeItem("userId");
    }
  },
};

export default googleAuthService;
