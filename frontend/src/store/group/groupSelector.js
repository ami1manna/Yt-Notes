// GROUP LIST
export const selectGroupList = (state) => state.group.groupList;

// SELECTED GROUP
export const selectSelectedGroupId = (state) => state.group.selectedGroupId;
export const selectSelectedGroup = (state) => {
  const { groupList, selectedGroupId } = state.group;
  return groupList.find(group => group._id === selectedGroupId) || null;
};

// FETCH STATE
export const isGroupFetching = (state) => state.group.fetch.status === "pending";
export const getGroupFetchError = (state) => state.group.fetch.error;

// CREATE STATE
export const isGroupCreating = (state) => state.group.create.status === "pending";
export const getGroupCreateError = (state) => state.group.create.error;
