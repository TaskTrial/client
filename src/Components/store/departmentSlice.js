// src/store/departmentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  departments: [],
  pagination: {},
  id: "N/A",
  name: "N/A",
  description: "N/A",
  createdAt: "N/A",
  updatedAt: "N/A",
  deletedAt: null,
  organizationId: "N/A",
  organization: {},
  managerId: "N/A",
  manager: {},
  users: [],
  teams: [],
  //   department: null,
  //   loading: false,
  //   error: null,
};

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    setDepartment: (state, action) => {
      const deptData = action.payload.data;
      if (deptData) {
        Object.keys(deptData).forEach((key) => {
          if (key in state) {
            state[key] = deptData[key];
          }
        });
      }
      //   state.error = null;
    },
    // setLoading: (state, action) => {
    //   state.loading = action.payload;
    // },
    // setError: (state, action) => {
    //   state.error = action.payload;
    // },
    clearDepartment: () => initialState,
  },
});
// setLoading, setError,
export const { setDepartment, clearDepartment } = departmentSlice.actions;

export default departmentSlice.reducer;
