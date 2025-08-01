import { createSlice } from "@reduxjs/toolkit";
import { fetchGroups, createGroup } from "./groupThunks";


const initialState = {
  groupList: [],
  fetch: {
    status: "idle",  // 'idle' | 'pending' | 'succeeded' | 'failed'
    error: null,
  },
  create: {
    status: "idle",
    error: null,
  },
  selectedGroupId: null,
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
     // {action.payload and action.type } -> payload
    addGroup: (state, { payload }) => { 
      state.groupList.push(payload);
    },
    removeGroup: (state, { payload }) => {
      state.groupList = state.groupList.filter(group => group._id !== payload);
    },
    updateGroup: (state, { payload }) => {
      const index = state.groupList.findIndex(group => group._id === payload._id);
      if (index !== -1) state.groupList[index] = payload;
    },
    setSelectedGroup: (state, { payload }) => {
      state.selectedGroupId = payload;
    },
     resetCreateState: (state) => {
      state.create.status = "idle";
      state.create.error = null;
      console.log(state.create);
    }
  },
  extraReducers: (builder) => {
    builder
      // FETCH GROUPS
      .addCase(fetchGroups.pending, (state) => {
        state.fetch.status = "pending";
        state.fetch.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, { payload }) => {
        state.groupList = payload;
        state.fetch.status = "succeeded";
      })
      .addCase(fetchGroups.rejected, (state, { error, payload }) => {
        state.fetch.status = "failed";
        state.fetch.error = payload || error?.message || "Failed to fetch groups";
      })

      // CREATE GROUP
      .addCase(createGroup.pending, (state) => {
        state.create.status = "pending";
        state.create.error = null;
      })
      .addCase(createGroup.fulfilled, (state, { payload }) => {
        state.groupList.push(payload);
        state.create.status = "succeeded";
      })
      .addCase(createGroup.rejected, (state, { error, payload }) => {
        state.create.status = "failed";
        state.create.error = payload || error?.message || "Failed to create group";
      })
    },
  
});

export const {
  addGroup,
  removeGroup,
  updateGroup,
  setSelectedGroup,
  resetCreateState
} = groupSlice.actions;

export default groupSlice.reducer;
