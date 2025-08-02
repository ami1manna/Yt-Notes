import { configureStore } from '@reduxjs/toolkit';
import groupReducer from './group';
import groupDetailsReducer from './groupDetails';
import inviteReducer from './invite';

const store = configureStore({
  reducer: {
    group: groupReducer,
    groupDetails: groupDetailsReducer,
    invites: inviteReducer,
  },
});

export default store;
