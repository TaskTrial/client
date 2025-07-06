// src/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import organizationReducer from "./organizationSlice";
import departmentReducer from "./departmentSlice";
import teamReducer from "./teamSlice";
import projectReducer from "./projectSlice";
import taskReducer from "./taskSlice";
// export const store = configureStore({
//   reducer: {
//     user: userReducer,
//     organization: organizationReducer,
//     department: departmentReducer,
//     team: teamReducer,
//     project: projectReducer,
//     task: taskReducer,
//   },
// });

const appReducer = combineReducers({
  user: userReducer,
  organization: organizationReducer,
  department: departmentReducer,
  team: teamReducer,
  project: projectReducer,
  task: taskReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_APP") {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});
