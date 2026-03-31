import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Initialize from localStorage immediately
  isDarkMode: localStorage.getItem("theme") === "dark",
  isSidebarOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      const theme = state.isDarkMode ? "dark" : "light";
      localStorage.setItem("theme", theme);

      if (state.isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },

    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },

    openSidebar: (state) => {
      state.isSidebarOpen = true;
    },
  },
});

export const { toggleTheme, toggleSidebar, closeSidebar, openSidebar } =
  uiSlice.actions;
export default uiSlice.reducer;
