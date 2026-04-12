import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/slices/uiSlice";

const ThemeToggle = () => {
  const { isDarkMode } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch(toggleTheme())} aria-label="Toggle Theme">
      {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
};

export default ThemeToggle;
