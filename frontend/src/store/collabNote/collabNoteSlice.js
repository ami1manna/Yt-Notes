import { createSlice } from "@reduxjs/toolkit";
import * as collabNoteThunks from "./collabNoteThunks";

const initialState = {
  note: null,
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

const collabNoteSlice = createSlice({
  name: "collabNote",
  initialState,
  reducers: {
    setNote(state, action) {
      state.note = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearNote(state) {
      state.note = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(collabNoteThunks.saveNote.pending, (state) => {
        state.status = "loading";
      })
      .addCase(collabNoteThunks.saveNote.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.note = action.payload;
      })
      .addCase(collabNoteThunks.saveNote.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(collabNoteThunks.fetchNote.pending, (state) => {
        state.status = "loading";
      })
      .addCase(collabNoteThunks.fetchNote.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.note = action.payload;
      })
      .addCase(collabNoteThunks.fetchNote.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(collabNoteThunks.deleteNote.pending, (state) => {
        state.status = "loading";
      })
      .addCase(collabNoteThunks.deleteNote.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.note = null; // Or handle differently if needed
      })
      .addCase(collabNoteThunks.deleteNote.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setNote, setStatus, setError, clearNote } =
  collabNoteSlice.actions;

export default collabNoteSlice.reducer;
