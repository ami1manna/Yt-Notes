import { createSelector } from "@reduxjs/toolkit";

// Root selector for collabNote slice
const selectCollabNoteState = (state) => state.collabNote;

// Get note content
export const getCollabNoteContent = createSelector(
  [selectCollabNoteState],
  (state) => state.note?.content || ""
);

// Get last modified by user
export const getLastModifiedBy = createSelector(
  [selectCollabNoteState],
  (state) => state.note?.lastModifiedBy || ""
);

// Get created by user
export const getCreatedBy = createSelector(
  [selectCollabNoteState],
  (state) => state.note?.createdBy || ""
);

// Status (loading, succeeded, etc.)
export const getCollabNoteStatus = createSelector(
  [selectCollabNoteState],
  (state) => state.status
);

// Error
export const getCollabNoteError = createSelector(
  [selectCollabNoteState],
  (state) => state.error
);
