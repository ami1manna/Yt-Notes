// src/store/index.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";

import groupReducer from "./group";
import groupDetailsReducer from "./groupDetails";
import inviteReducer from "./invite";
import groupPlaylistDetailsReducer from "./groupPlaylist";
import collabNoteReducer from "./collabNote";
// Presence slices
import presenceReducer from "./presence";
 
 

const store = configureStore({
  reducer: {
    group: groupReducer,
    groupDetails: groupDetailsReducer,
    invites: inviteReducer,
    groupPlaylistDetails: groupPlaylistDetailsReducer,
    presence: presenceReducer,
    collabNote:collabNoteReducer,
  },
});

export default store;
