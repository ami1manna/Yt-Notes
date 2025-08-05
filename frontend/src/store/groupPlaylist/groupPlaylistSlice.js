import { createSlice } from '@reduxjs/toolkit';
import { fetchGroupPlaylistDetails } from './groupPlaylistThunks';

const initialState = {
  groupPlaylistDetails: null,
  selectedVideo: null,
  status: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
  error: null,
};

const groupPlaylistDetailsSlice = createSlice({
  name: 'groupPlaylistDetails',
  initialState,
  reducers: {
    clearGroupPlaylistDetails: (state) => {
      state.groupPlaylistDetails = null;
      state.selectedVideo = null;
      state.status = 'idle';
      state.error = null;
    },
    setSelectedVideo: (state, action) => {
      state.selectedVideo = action.payload;
    },
    clearSelectedVideo: (state) => {
      state.selectedVideo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupPlaylistDetails.pending, (state) => {
        state.status = 'pending';
        state.error = null;
      })
      .addCase(fetchGroupPlaylistDetails.fulfilled, (state, { payload }) => {
        state.groupPlaylistDetails = payload;
        state.status = 'succeeded';
        // Auto-select first video
        state.selectedVideo = payload?.videos?.[0] || null;
      })
      .addCase(fetchGroupPlaylistDetails.rejected, (state, { error, payload }) => {
        state.status = 'failed';
        state.error = payload || error?.message || 'Failed to fetch group details';
      });
  },
});

export const {
  clearGroupPlaylistDetails,
  setSelectedVideo,
  clearSelectedVideo,
} = groupPlaylistDetailsSlice.actions;

export default groupPlaylistDetailsSlice.reducer;
