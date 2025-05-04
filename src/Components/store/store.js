// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import organizationReducer from "./organizationSlice";
import departmentReducer from "./departmentSlice";
import teamReducer from "./teamSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    organization: organizationReducer,
    department: departmentReducer,
    team: teamReducer,
  },
});
