// src/store/organizationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  name: "",
  industry: "",
  sizeRange: "",
  contactEmail: "",
  contactPhone: "",
  description: "",
  createdAt: "",
  updatedAt: "",
  website: "",
  address: "",
  logoUrl: "",
  orgOwnerId: "",
  status: "",
  isVerified: false,
  organizationOwner: {},
  statistics: {},
  owners: [],
  departments: [],
  pagination: {},
  teams: [],
  projects: [],
  users: [],
  hasMoreDepartments: false,
  hasMoreTeams: false,
  hasMoreProjects: false,
  addedOwners: [],
  skippedOwners: [],
  joinCode: "",
  createdBy: "",
};
///////
const orgId = localStorage.getItem("orgId");

initialState.id = orgId || "";

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setOrganization(state, action) {
      const payload = action.payload;

      const org =
        payload?.data?.organization ||
        payload?.organization ||
        payload?.organizationData ||
        null;

      if (org) {
        Object.keys(org).forEach((key) => {
          if (key in state) {
            state[key] = org[key];
          }
        });
      }

      const orgOwner =
        payload?.data?.organizationOwner || payload?.organizationOwner || null;

      if (orgOwner) {
        state.organizationOwner = orgOwner;
      }

      Object.keys(payload).forEach((key) => {
        if (
          key in state &&
          key !== "organization" &&
          key !== "organizationOwner" &&
          key !== "data"
        ) {
          state[key] = payload[key];
        }
      });

      if (payload.data) {
        Object.keys(payload.data).forEach((key) => {
          if (
            key in state &&
            key !== "organization" &&
            key !== "organizationOwner"
          ) {
            state[key] = payload.data[key];
          }
        });
      }
    },
    clearOrganization() {
      localStorage.clear();
    },
  },
});

export const { setOrganization, clearOrganization } = organizationSlice.actions;
export default organizationSlice.reducer;
