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
  organization: null,
  permissions: [],
  teamMemberships: [],
  activityLogs: [],
};
const authorized = localStorage.getItem("auth");
const savedUser = localStorage.getItem("user");
const savedUserGet = localStorage.getItem("getUser");
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");
if (savedUser && authorized) {
  // const user = JSON.parse(savedUser);
  // const getUser = JSON.parse(savedUserGet);
  const user = savedUser ? JSON.parse(savedUser) : {};
  const getUser = savedUserGet ? JSON.parse(savedUserGet) : {};
  initialState.id = user?.id || "";
  initialState.email = user?.email || "";
  initialState.role = user?.role || "";
  initialState.accessToken = accessToken;
  initialState.refreshToken = refreshToken;
  /////////
  initialState.isAuthenticated = authorized;
  ///////////
  initialState.username = getUser.username;
  initialState.firstName = getUser.firstName;
  initialState.lastName = getUser.lastName;
  initialState.profilePic = getUser.profilePic;
  initialState.phoneNumber = getUser.phoneNumber;
  initialState.jobTitle = getUser.jobTitle;
  initialState.timezone = getUser.timezone;
  initialState.bio = getUser.bio;
  initialState.preferences = getUser.preferences;
  initialState.isActive = getUser.isActive;
  initialState.isOwner = getUser.isOwner;
  initialState.createdAt = getUser.createdAt;
  initialState.updatedAt = getUser.updatedAt;
  initialState.lastLogin = getUser.lastLogin;
  initialState.lastLogout = getUser.lastLogout;
  initialState.department = getUser.department;
  initialState.organization = getUser.organization;
  initialState.permissions = getUser.permissions;
  initialState.teamMemberships = getUser.teamMemberships;
  initialState.activityLogs = getUser.activityLogs;
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
      const userData = action.payload.user;
      Object.keys(userData).forEach((key) => {
        if (key in state) {
          state[key] = userData[key];
        }
      });
    },
    logout(state) {
      state.id = "";
      state.email = "";
      state.role = "";
      state.accessToken = "";
      state.refreshToken = "";
      //////
      state.isAuthenticated = "";
      ////////
      state.username = "";
      state.firstName = "";
      state.lastName = "";
      state.profilePic = null;
      state.phoneNumber = null;
      state.jobTitle = null;
      state.timezone = null;
      state.bio = null;
      state.preferences = null;
      state.isActive = false;
      state.isOwner = false;
      state.createdAt = "";
      state.updatedAt = "";
      state.lastLogin = "";
      state.lastLogout = null;
      state.department = null;
      state.organization = null;
      state.permissions = [];
      state.teamMemberships = [];
      state.activityLogs = [];
      ////////
      localStorage.clear();
      // localStorage.removeItem("auth");
      // localStorage.removeItem("user");
      // localStorage.removeItem("getUser");
      // localStorage.removeItem("accessToken");
      // localStorage.removeItem("refreshToken");
    },
  },
});

export const { login, logout, getUser } = userSlice.actions;
export default userSlice.reducer;

/////////////////////////////////////
// const {
//   id,
//   email,
//   role,
//   username,
//   firstName,
//   lastName,
//   profilePic,
//   phoneNumber,
//   jobTitle,
//   timezone,
//   bio,
//   preferences,
//   isActive,
//   isOwner,
//   createdAt,
//   updatedAt,
//   lastLogin,
//   lastLogout,
//   department,
//   organization,
//   permissions,
//   teamMemberships,
//   activityLogs,
// } = action.payload.user;
// state.id = id;
// state.email = email;
// state.role = role;
// state.username = username;
// state.firstName = firstName;
// state.lastName = lastName;
// state.profilePic = profilePic;
// state.phoneNumber = phoneNumber;
// state.jobTitle = jobTitle;
// state.timezone = timezone;
// state.bio = bio;
// state.preferences = preferences;
// state.isActive = isActive;
// state.isOwner = isOwner;
// state.createdAt = createdAt;
// state.updatedAt = updatedAt;
// state.lastLogin = lastLogin;
// state.lastLogout = lastLogout;
// state.department = department;
// state.organization = organization;
// state.permissions = permissions;
// state.teamMemberships = teamMemberships;
// state.activityLogs = activityLogs;
