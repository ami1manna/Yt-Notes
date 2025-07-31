// import React, { createContext, useContext, useReducer, useCallback } from 'react';
// import {
//   fetchGroups as fetchGroupsApi,
//   fetchGroupById as fetchGroupByIdApi,
//   createGroup as createGroupApi,
//   updateGroup as updateGroupApi,
//   deleteGroup as deleteGroupApi,
//   sharePlaylistWithGroup as sharePlaylistWithGroupApi,
//   inviteToGroup as inviteToGroupApi,
//   respondToInvite as respondToInviteApi,
//   fetchMyInvites as fetchMyInvitesApi
// } from '../utils/GroupUtils';

// const GroupContext = createContext();

// const initialState = {
//   groupList: [],
//   groupListLoading: false,
//   groupListError: null,
// };

// function groupReducer(state, action) {
//   switch (action.type) {
//     case 'FETCH_GROUPS_START':
//       return { ...state, groupListLoading: true, groupListError: null };
//     case 'FETCH_GROUPS_SUCCESS':
//       return { ...state, groupList: action.payload, groupListLoading: false };
//     case 'FETCH_GROUPS_ERROR':
//       return { ...state, groupListError: action.payload, groupListLoading: false };
//     default:
//       return state;
//   }
// }

// export function GroupProvider({ children }) {
//   const [state, dispatch] = useReducer(groupReducer, initialState);

//   const fetchGroups = useCallback(async () => {
//     dispatch({ type: 'FETCH_GROUPS_START' });
//     const { groups, error } = await fetchGroupsApi();
//     if (error) {
//       dispatch({ type: 'FETCH_GROUPS_ERROR', payload: error });
//     } else {
//       dispatch({ type: 'FETCH_GROUPS_SUCCESS', payload: groups });
//     }
//     return { groups, error };
//   }, []);

//   const fetchGroupById = useCallback(async (groupId) => {
//     return await fetchGroupByIdApi(groupId);
//   }, []);

//   const createGroup = useCallback(async (data) => {
//     return await createGroupApi(data);
//   }, []);

//   const updateGroup = useCallback(async (groupId, data) => {
//     return await updateGroupApi(groupId, data);
//   }, []);

//   const deleteGroup = useCallback(async (groupId) => {
//     return await deleteGroupApi(groupId);
//   }, []);

//   const sharePlaylistWithGroup = useCallback(async (groupId, playlistId) => {
//     return await sharePlaylistWithGroupApi(groupId, playlistId);
//   }, []);

//   // Add inviteToGroup function
//   const inviteToGroup = useCallback(async (groupId, email) => {
//     return await inviteToGroupApi(groupId, email);
//   }, []);

//   // Add respondToInvite function
//   const respondToInvite = useCallback(async (inviteId, action) => {
//     return await respondToInviteApi(inviteId, action);
//   }, []);

//   // Add fetchMyInvites function
//   const fetchMyInvites = useCallback(async () => {
//     return await fetchMyInvitesApi();
//   }, []);

//   return (
//     <GroupContext.Provider
//       value={{
//         groupList: state.groupList,
//         groupListLoading: state.groupListLoading,
//         groupListError: state.groupListError,
//         fetchGroups,
//         fetchGroupById,
//         createGroup,
//         updateGroup,
//         deleteGroup,
//         sharePlaylistWithGroup,
//         inviteToGroup,
//         respondToInvite,
//         fetchMyInvites,
//       }}
//     >
//       {children}
//     </GroupContext.Provider>
//   );
// }

// export function useGroupContext() {
//   return useContext(GroupContext);
// } 