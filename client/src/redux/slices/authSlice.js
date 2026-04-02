import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  access_token: null,
};

// authSlice.js - Updated reducer
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload; // ✅ Directly set the user
      state.access_token = null; // Token is in httpOnly cookie, not needed here
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.access_token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
