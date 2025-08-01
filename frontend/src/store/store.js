import { configureStore } from '@reduxjs/toolkit';
import groupReducer from './group';
import groupDetailsReducer from './groupDetails';

const store = configureStore({
  reducer: {
    group: groupReducer,
    groupDetails:groupDetailsReducer
  },
});

export default store;
