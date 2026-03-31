import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/slices/uiSlice";

const ThemeToggle = () => {
  const { isDarkMode } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="relative flex items-center justify-center w-12 h-6 rounded-full bg-surface-tertiary border border-border-default transition-all duration-300 hover:border-primary-600 focus:outline-none group"
      aria-label="Toggle Theme"
    >
      {/* Track Background Decor */}
      <div className="absolute inset-0 flex justify-between px-1.5 items-center opacity-40 pointer-events-none">
        <Moon
          size={10}
          className={isDarkMode ? "text-primary-400" : "text-content-muted"}
        />
        <Sun
          size={10}
          className={!isDarkMode ? "text-amber-500" : "text-content-muted"}
        />
      </div>

      {/* Sliding Knob */}
      <div
        className={`absolute w-5 h-5 rounded-full bg-white shadow-sm border border-border-default transition-transform duration-300 ease-spring flex items-center justify-center ${
          isDarkMode ? "translate-x-3" : "-translate-x-3"
        }`}
      >
        {isDarkMode ? (
          <Moon size={10} className="text-primary-600" />
        ) : (
          <Sun size={10} className="text-amber-500" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
