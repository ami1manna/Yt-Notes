import { createSelector } from "@reduxjs/toolkit";

const selectGroupDetailsState = (state) => state.groupDetails;

export const getGroupDetails = createSelector(
  [selectGroupDetailsState],
  (groupDetailsState) => groupDetailsState.groupDetails
);

export const isGroupDetailsFetching = createSelector(
  [selectGroupDetailsState],
  (groupDetailsState) => groupDetailsState.status === "pending"
);

export const getGroupDetailsFetchError = createSelector(
  [selectGroupDetailsState],
  (groupDetailsState) => groupDetailsState.error
);
