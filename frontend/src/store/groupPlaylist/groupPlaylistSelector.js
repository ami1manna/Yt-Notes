import { createSelector } from "@reduxjs/toolkit";

// Root selector
const selectGroupPlaylistDetailsState = (state) => state.groupPlaylistDetails;

// Selector: main playlist details object
export const getGroupPlaylistDetails = createSelector(
  [selectGroupPlaylistDetailsState],
  (state) => state.groupPlaylistDetails
);

// Selector: loading state
export const isGroupPlaylistDetailsFetching = createSelector(
  [selectGroupPlaylistDetailsState],
  (state) => state.status === "pending"
);

// Selector: error message
export const getGroupPlaylistDetailsFetchError = createSelector(
  [selectGroupPlaylistDetailsState],
  (state) => state.error
);

// Selector: selected video
export const getCurrentVideo = (state) => state.groupPlaylistDetails.selectedVideo;
