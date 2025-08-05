import { createSelector } from "@reduxjs/toolkit";

const selectCollabNoteState = (state) => state.collabNote;

export const getCollabNote = createSelector(
  [selectCollabNoteState],
  (state) => state.note
);

export const getCollabNoteStatus = createSelector(
  [selectCollabNoteState],
  (state) => state.status
);

export const getCollabNoteError = createSelector(
  [selectCollabNoteState],
  (state) => state.error
);
