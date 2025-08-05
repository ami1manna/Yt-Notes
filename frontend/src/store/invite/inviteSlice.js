import { createSlice } from '@reduxjs/toolkit';
import { fetchMyInvites, respondToInvite } from './inviteThunks';

const initialState = {
  inviteList: [],
  fetch: { status: 'idle', error: null },
  respond: { status: 'idle', error: null },
};

const inviteSlice = createSlice({
  name: 'invites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Invites
      .addCase(fetchMyInvites.pending, (state) => {
        state.fetch.status = 'pending';
        state.fetch.error = null;
      })
      .addCase(fetchMyInvites.fulfilled, (state, action) => {
        state.fetch.status = 'succeeded';
        state.inviteList = action.payload;
      })
      .addCase(fetchMyInvites.rejected, (state, action) => {
        state.fetch.status = 'failed';
        state.fetch.error = action.payload || 'Error fetching invites';
      })

      // Respond to Invite
      .addCase(respondToInvite.pending, (state) => {
        state.respond.status = 'pending';
        state.respond.error = null;
      })
      .addCase(respondToInvite.fulfilled, (state, action) => {
        state.respond.status = 'succeeded';
        // Remove responded invite
        state.inviteList = state.inviteList.filter(inv => inv._id !== action.payload._id);
      })
      .addCase(respondToInvite.rejected, (state, action) => {
        state.respond.status = 'failed';
        state.respond.error = action.payload || 'Error responding to invite';
      });
  },
});

export default inviteSlice.reducer;
