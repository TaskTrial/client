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
const savedOrganization = localStorage.getItem("dataOrganization");
const savedOrganizationOwner = localStorage.getItem("organizationOwner");

let parsedOrgorg = {};
let parsedOrg2org = {};
try {
  if (savedOrganization && savedOrganization !== "undefined") {
    parsedOrgorg = JSON.parse(savedOrganization);
  }
  if (savedOrganizationOwner && savedOrganizationOwner !== "undefined") {
    parsedOrg2org = JSON.parse(savedOrganizationOwner);
  }
} catch (error) {
  console.error("Failed to parse localStorage data:", error);
}
if (savedOrganization) {
  const parsedOrg = parsedOrgorg;
  const parsedOrg2 = parsedOrg2org;
  initialState.id = parsedOrg.id || "";
  initialState.name = parsedOrg.name || "";
  initialState.status = parsedOrg.status || "";
  initialState.isVerified = parsedOrg.isVerified || false;
  initialState.organizationOwner = parsedOrg2 || {};
  //////
  initialState.description = parsedOrg.description || "";
  initialState.sizeRange = parsedOrg.sizeRange || "";
  initialState.industry = parsedOrg.industry || "";
  initialState.website = parsedOrg.website || "";
  initialState.logoUrl = parsedOrg.logoUrl || "";
  initialState.orgOwnerId = parsedOrg.orgOwnerId || "";
  initialState.contactEmail = parsedOrg.contactEmail || "";
  initialState.contactPhone = parsedOrg.contactPhone || "";
  initialState.address = parsedOrg.address || "";
  initialState.createdAt = parsedOrg.createdAt || "";
  initialState.updatedAt = parsedOrg.updatedAt || "";
  //////
  initialState.statistics = parsedOrg.statistics || null;
  initialState.owners = parsedOrg.owners || null;
  initialState.departments = parsedOrg.departments || null;
  initialState.pagination = parsedOrg.pagination || null;
  initialState.teams = parsedOrg.teams || null;
  initialState.projects = parsedOrg.projects || null;
  initialState.hasMoreDepartments = parsedOrg.hasMoreDepartments || false;
  initialState.hasMoreTeams = parsedOrg.hasMoreTeams || false;
  initialState.hasMoreProjects = parsedOrg.hasMoreProjects || false;
  ///////
  initialState.addedOwners = parsedOrg.addedOwners || null;
  initialState.skippedOwners = parsedOrg.skippedOwners || null;
  initialState.joinCode = parsedOrg.joinCode || "";
  initialState.createdBy = parsedOrg.createdBy || "";
  initialState.users = parsedOrg.users || null;
}
const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    // setOrganization(state, action) {
    //   const org = action.payload.data.organization;
    //   if (org) {
    //     Object.keys(org).forEach((key) => {
    //       if (key in state) {
    //         state[key] = org[key];
    //       }
    //     });
    //   }

    //   const org2 =
    //     action.payload.data.organizationOwner || initialState.organizationOwner;
    //   state.organizationOwner = org2;

    //   const org3 = action.payload.data;
    //   if (org3) {
    //     Object.keys(org3).forEach((key) => {
    //       if (key in state) {
    //         state[key] = org3[key];
    //       }
    //     });
    //   }

    //   const org4 = action.payload.organization;
    //   if (org4) {
    //     Object.keys(org4).forEach((key) => {
    //       if (key in state) {
    //         state[key] = org4[key];
    //       }
    //     });
    //   }
    // },
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
      localStorage.removeItem("dataOrganization");
      localStorage.removeItem("organizationOwner");
      return {
        id: "",
        name: "",
        description: "",
        industry: "",
        sizeRange: "",
        website: "",
        logoUrl: "",
        address: "",
        status: "",
        contactEmail: "",
        contactPhone: "",
        orgOwnerId: "",
        isVerified: false,
        createdAt: "",
        updatedAt: "",
        organizationOwner: {},
        joinCode: "",
        createdBy: "",
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
      };
    },
  },
});

export const { setOrganization, clearOrganization } = organizationSlice.actions;
export default organizationSlice.reducer;
