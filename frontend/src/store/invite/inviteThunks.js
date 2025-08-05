import {  createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMyInvitesAPI, respondToInviteAPI } from './inviteService';
 

// Thunk: Fetch user's invites
export const fetchMyInvites = createAsyncThunk(
  'invites/fetchMyInvites',
  async (_, thunkAPI) => {
    const { invites, error } = await fetchMyInvitesAPI();
    
    if (error) return thunkAPI.rejectWithValue(error);
    return invites;
  }
);

// Thunk: Respond to invite
export const respondToInvite = createAsyncThunk(
  'invites/respondToInvite',
  async ({ inviteId, action }, thunkAPI) => {
    const { success, invite, error } = await respondToInviteAPI(inviteId, action);
    if (!success) return thunkAPI.rejectWithValue(error);
    return invite;
  }
);

