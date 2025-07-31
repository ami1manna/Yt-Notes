import { configureStore } from '@reduxjs/toolkit';
import groupReducer from './slices/groupSlice';

const store = configureStore({
  reducer: {
    group: groupReducer,
  },
});

export default store;
