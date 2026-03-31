import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Initialize as null so "isAuthenticated: false" makes sense
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Corrected spelling to match industry standards
    setCredentials: (state, action) => {
      console.log(action.payload);
      state.user = action.payload;
      state.token = true;
    },
    // Logout clears the state
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

// ✅ Matches the reducer names exactly
export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
