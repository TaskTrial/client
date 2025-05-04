// src/store/teamSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teams: [],
  pagination: {},
  team: {},
  members: [],
  projects: [],
  recentReports: [],
  statistics: {},
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeam(state, action) {
      // state.currentTeam = action.payload;
      const teamData = action.payload.data;
      if (teamData) {
        Object.keys(teamData).forEach((key) => {
          if (key in state) {
            state[key] = teamData[key];
          }
        });
      }
    },
    setTeams(state, action) {
      state.teams = action.payload;
    },
    addTeam(state, action) {
      state.teams.push(action.payload);
    },
  },
});

export const { setTeam, setTeams, addTeam } = teamSlice.actions;
export default teamSlice.reducer;
