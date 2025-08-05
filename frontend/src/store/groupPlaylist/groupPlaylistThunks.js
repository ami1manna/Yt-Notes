import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchGroupPlaylistsAPI } from "./groupPlaylistService";

export const fetchGroupPlaylistDetails = createAsyncThunk(
  "groupPlaylistDetails/fetch",
  async ({ groupId, playlistId }, thunkAPI) => {
    const { groupPlaylistDetails, error } = await fetchGroupPlaylistsAPI(groupId,playlistId);
    if (error) return thunkAPI.rejectWithValue(error);
    return groupPlaylistDetails;
  }
);
