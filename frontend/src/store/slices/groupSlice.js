import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchGroupsAPI, createGroupAPI } from "@/utils/GroupUtils";  

const initialState = {
  groupList: [],
  loading: false,
  error: null,
};

export const fetchGroups = createAsyncThunk(
  "group/fetchGroups",
  async (_, thunkAPI) => {
    const { groups, error } = await fetchGroupsAPI();
    if (error) return thunkAPI.rejectWithValue(error);
    return groups;
  }
);

export const createGroup = createAsyncThunk(
  "group/createGroup",
  async (groupPayload, thunkAPI) => {
    const { group, error } = await createGroupAPI(groupPayload);
    if (error) return thunkAPI.rejectWithValue(error);
    return {...group , role: 'admin'};
  }
);

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    addGroup: (state, action) => {
      state.groupList.push(action.payload);
    },
    removeGroup: (state, action) => {
      state.groupList = state.groupList.filter(
        (group) => group._id !== action.payload
      );
    },
    updateGroup: (state, action) => {
      const updatedGroup = action.payload;
      const index = state.groupList.findIndex(
        (group) => group._id === updatedGroup._id
      );
      if (index !== -1) {
        state.groupList[index] = updatedGroup;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchGroups
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.groupList = action.payload;
        state.loading = false;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error?.message || "Failed to fetch groups";
      })

      // createGroup
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groupList.push(action.payload);
        state.loading = false;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error?.message || "Failed to create group";
      });
  },
});

export const { addGroup, removeGroup, updateGroup } = groupSlice.actions;

export default groupSlice.reducer;
