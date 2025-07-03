import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
  activeProjects: [],
  //   team: {},
  //   members: [],
  //   taskStats: {},
  //   tasks: [],
  archivedProjects: [],
  statistics: {},
  pagination: {},
  //////project details///////
  id: "",
  name: "",
  description: "",
  status: "",
  createdBy: "",
  organizationId: "",
  teamId: "",
  startDate: "",
  endDate: "",
  createdAt: "",
  updatedAt: "",
  deletedAt: "",
  priority: "",
  progress: 0,
  budget: 0,
  lastModifiedBy: "",
  ProjectMember: [],
  tasks: [],
  members: [],
  memberCount: 0,
  taskCount: 0,
  userRole: "",
};
const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjects(state, action) {
      const projectsData = action.payload.data;
      if (projectsData) {
        Object.keys(projectsData).forEach((key) => {
          if (key in state) {
            state[key] = projectsData[key];
          }
        });
      }
    },
    projectDetails(state, action) {
      const projectData = action.payload.data;
      if (projectData) {
        Object.keys(projectData).forEach((key) => {
          if (key in state) {
            state[key] = projectData[key];
          }
        });
      }
    },
    setTeamProjects(state, action) {
      state.projects = action.payload.data;
    },
    clearSelectedProject(state) {
      state.selectedProject = null;
    },
  },
});

export const {
  setProjects,
  projectDetails,
  setTeamProjects,
  clearSelectedProject,
} = projectSlice.actions;

export default projectSlice.reducer;
