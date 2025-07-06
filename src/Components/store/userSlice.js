// src/store/userSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  email: "",
  role: "",
  accessToken: "",
  refreshToken: "",
  isAuthenticated: "",
  username: "",
  firstName: "",
  lastName: "",
  profilePic: null,
  phoneNumber: null,
  jobTitle: null,
  timezone: null,
  bio: null,
  preferences: null,
  isActive: false,
  isOwner: false,
  createdAt: "",
  updatedAt: "",
  lastLogin: "",
  lastLogout: null,
  department: null,
  organization: {},
  permissions: [],
  teamMemberships: [],
  activityLogs: [],
};
const authorized = localStorage.getItem("auth");
const userId = localStorage.getItem("userId");
const orgId = localStorage.getItem("orgId");
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");
if (userId && orgId && authorized) {
  initialState.id = userId || "";
  initialState.organization.id = orgId || "";

  initialState.accessToken = accessToken;
  initialState.refreshToken = refreshToken;
  initialState.isAuthenticated = authorized;
}
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      const { id, email, role } = action.payload.user;

      state.id = id;
      state.email = email;
      state.role = role;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = "true";

      //localStorage.setItem("user", JSON.stringify({ id, email, role }));
    },
    getUser(state, action) {
      // Object.assign(state, action.payload.user);
      const userData = action.payload.user;
      if (userData) {
        Object.keys(userData).forEach((key) => {
          if (key in state) {
            state[key] = userData[key];
          }
        });
      }
      Object.keys(userData).forEach((key) => {
        if (key in state) {
          state[key] = userData[key];
        }
      });
      const userData2 = action.payload.getUser;
      if (userData2) {
        Object.keys(userData2).forEach((key) => {
          if (key in state) {
            state[key] = userData2[key];
          }
        });
      }

      const userData3 = action.payload;
      if (userData3) {
        Object.keys(userData3).forEach((key) => {
          if (key in state) {
            state[key] = userData3[key];
          }
        });
      }
    },
    logout() {
      localStorage.clear();
    },
  },
});

export const { login, logout, getUser } = userSlice.actions;
export default userSlice.reducer;
