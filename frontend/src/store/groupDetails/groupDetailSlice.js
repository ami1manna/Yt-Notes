import { createSlice } from '@reduxjs/toolkit';
import { fetchGroupDetails } from './groupDetailThunk';
 
const initialState = {
  groupDetails: null,
  status: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
  error: null,
};

const groupDetailsSlice = createSlice({
  name: 'groupDetails',
  initialState,
  reducers: {
    clearGroupDetails: (state) => {
      state.groupDetails = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupDetails.pending, (state) => {
        state.status = 'pending';
        state.error = null;
      })
      .addCase(fetchGroupDetails.fulfilled, (state, { payload }) => {
        state.groupDetails = payload;
        state.status = 'succeeded';
      })
      .addCase(fetchGroupDetails.rejected, (state, { error, payload }) => {
        state.status = 'failed';
        state.error = payload || error?.message || 'Failed to fetch group details';
      });
  },
});

export const { clearGroupDetails } = groupDetailsSlice.actions;
export default groupDetailsSlice.reducer;
