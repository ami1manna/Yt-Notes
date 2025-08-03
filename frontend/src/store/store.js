import { configureStore } from '@reduxjs/toolkit';
import groupReducer from './group';
import groupDetailsReducer from './groupDetails';
import inviteReducer from './invite';
import groupPlaylistDetailsReducer from './groupPlaylist';

const store = configureStore({
  reducer: {
    group: groupReducer,
    groupDetails: groupDetailsReducer,
    invites: inviteReducer,
    groupPlaylistDetails: groupPlaylistDetailsReducer
  },
});

export default store;
