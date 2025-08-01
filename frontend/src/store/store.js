import { configureStore } from '@reduxjs/toolkit';
import groupReducer from './group';

const store = configureStore({
  reducer: {
    group: groupReducer,
  },
});

export default store;
