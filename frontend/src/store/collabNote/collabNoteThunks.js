import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createNote = createAsyncThunk(
  "collabNote/createNote",
  async (noteData, thunkAPI) => {
    try {
      const response = await axios.post("/collab/create", noteData);
      console.log(response.data);
      return response.data;
    } catch (error) {

      return thunkAPI.rejectWithValue(error.response.data.message);
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

export const updateNote = createAsyncThunk(
  "collabNote/updateNote",
  async ({ noteId, noteData }, thunkAPI) => {
    try {
      const response = await axios.patch(`/collab/${noteId}`, noteData);
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
