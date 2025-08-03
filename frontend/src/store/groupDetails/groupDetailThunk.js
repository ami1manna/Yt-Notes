import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchGroupByIdAPI, sharePlaylistWithGroupAPI } from "./groupDetailService";

export const fetchGroupDetails = createAsyncThunk(
  "groupDetails/fetchGroupDetails",
  async (groupId, thunkAPI) => {
    const { groupDetails, error } = await fetchGroupByIdAPI(groupId);
    if (error) return thunkAPI.rejectWithValue(error);
    return groupDetails;
  }
);

export const sharePlaylistWithGroup = createAsyncThunk(
  "groupDetails/sharePlaylistWithGroup",
  async ({ groupId, playlistId, arrangeSections }, thunkAPI) => {
    const { groupDetails, error } = await sharePlaylistWithGroupAPI(
      groupId,
      playlistId,
      arrangeSections
    );

    if (error) return thunkAPI.rejectWithValue(error);

    // Trigger re-fetch of updated group after sharing playlist
    thunkAPI.dispatch(fetchGroupDetails(groupId));

    return groupDetails;
  }
);
