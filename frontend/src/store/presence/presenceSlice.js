import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: {}, // socketId → userPresence
};

const presenceSlice = createSlice({
  name: "presence",
  initialState,
  reducers: {
    setPresence(state, action) {
      const users = action.payload;
      state.users = Object.fromEntries(users.map((user) => [user.socketId, user]));
    },
    clearPresence(state) {
      state.users = {};
    },
  },
});

export const { setPresence, clearPresence } = presenceSlice.actions;
export default presenceSlice.reducer;
