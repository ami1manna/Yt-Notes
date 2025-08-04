// src/store/index.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";

import groupReducer from "./group";
import groupDetailsReducer from "./groupDetails";
import inviteReducer from "./invite";
import groupPlaylistDetailsReducer from "./groupPlaylist";

// Presence slices
import presenceReducer from "./presence";
 
 

const store = configureStore({
  reducer: {
    group: groupReducer,
    groupDetails: groupDetailsReducer,
    invites: inviteReducer,
    groupPlaylistDetails: groupPlaylistDetailsReducer,
     
    presence: presenceReducer,
  },
});

export default store;
