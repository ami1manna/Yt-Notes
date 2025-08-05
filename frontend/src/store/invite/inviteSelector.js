// INVITE LIST
export const selectInviteList = (state) => state.invites.inviteList;

// FETCH STATE
export const isInviteFetching = (state) => state.invites.fetch.status === 'pending';
export const getInviteFetchError = (state) => state.invites.fetch.error;

// RESPOND STATE
export const isInviteResponding = (state) => state.invites.respond.status === 'pending';
export const getInviteRespondError = (state) => state.invites.respond.error;

// SINGLE INVITE
export const getInviteById = (id) => (state) =>
  state.invites.inviteList.find(invite => invite._id === id) || null;
