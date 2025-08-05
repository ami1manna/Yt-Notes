import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
 
// POST /collab/saveNote
export const saveNote = createAsyncThunk(
  "collabNote/saveNote",
  async ({ groupId, playlistId, videoId, content }, thunkAPI) => {
    try {
      const response = await axios.post("/collab/saveNote", {
        groupId,
        playlistId,
        videoId,
        content,
      });

      return response.data; // full note object
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Save failed");
    }
  }
);


export const fetchNote = createAsyncThunk(
  "collabNote/fetchNote",
  async ({ videoId, playlistId, groupId }, thunkAPI) => {
    try {
      const response = await axios.get(
        `/collab?videoId=${videoId}&playlistId=${playlistId}&groupId=${groupId}`
      );
      return response.data;
    } catch (error) {
       
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

 

export const deleteNote = createAsyncThunk(
  "collabNote/deleteNote",
  async (noteId, thunkAPI) => {
    try {
      await axios.delete(`/collab/${noteId}`);
      return noteId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
