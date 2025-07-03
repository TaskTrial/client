// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import organizationReducer from "./organizationSlice";
import departmentReducer from "./departmentSlice";
import teamReducer from "./teamSlice";
import projectReducer from "./projectSlice";
import taskReducer from "./taskSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    organization: organizationReducer,
    department: departmentReducer,
    team: teamReducer,
    project: projectReducer,
    task: taskReducer,
  },
});
