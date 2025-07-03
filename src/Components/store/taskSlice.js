import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
  statistics: {},
  pagination: {},
  //////////task details//////
  id: "",
  title: "",
  description: "",
  priority: "",
  status: "",
  rate: null,
  projectId: "",
  sprintId: null,
  createdBy: "",
  assignedTo: "",
  dueDate: "",
  createdAt: "",
  updatedAt: "",
  deletedAt: null,
  estimatedTime: 0,
  actualTime: null,
  parentId: null,
  order: 0,
  labels: [],
  lastModifiedBy: "",
  creator: {},
  modifier: {},
  assignee: {},
  sprint: null,
  subtasks: [],
  parent: null,
  dependentOn: [],
  dependencies: [],
  comments: [],
  attachments: [],
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload.tasks || [];
      state.statistics = action.payload.statistics || {};
      state.pagination = action.payload.pagination || {};
    },
    taskDetails(state, action) {
      const taskData = action.payload.task;
      if (taskData) {
        Object.keys(taskData).forEach((key) => {
          if (key in state) {
            state[key] = taskData[key];
          }
        });
      }
    },
    clearTasks: (state) => {
      state.tasks = [];
      state.statistics = {};
      state.pagination = {};
    },
  },
});

export const { setTasks, taskDetails, clearTasks } = taskSlice.actions;

export default taskSlice.reducer;
