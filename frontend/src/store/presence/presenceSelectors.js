// selectors/presenceSelectors.js
import { createSelector } from "@reduxjs/toolkit";

export const selectPresenceUsers = (state) => state.presence.users || {};

// Memoized selector: only returns a new array if presence.users changes
export const selectAllUsers = createSelector(
  [selectPresenceUsers],
  (usersMap) => Object.values(usersMap)
);

export const selectUsersByPlaylist = createSelector(
  [selectAllUsers, (_, playlistId) => playlistId],
  (users, playlistId) => users.filter((u) => u.selectedPlaylistId === playlistId)
);

export const selectUsersByVideo = createSelector(
  [selectAllUsers, (_, videoId) => videoId],
  (users, videoId) => users.filter((u) => u.selectedVideoId === videoId)
);

export const selectUsersByNote = createSelector(
  [selectAllUsers, (_, noteId) => noteId],
  (users, noteId) => users.filter((u) => u.currentNoteId === noteId)
);
