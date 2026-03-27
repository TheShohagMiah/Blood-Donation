import { Bell, Command, Menu, Moon, Search, Sun, User, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const Header = ({
  isCollapsed,
  setIsCollapsed,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // ✅ Outside click handler
  useEffect(() => {
    const outSideClickHandler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", outSideClickHandler);
    return () => document.removeEventListener("mousedown", outSideClickHandler);
  }, []);

  // ✅ Keyboard shortcut (Ctrl/Cmd + K)
  useEffect(() => {
    const keyboardHandler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput =
          document.getElementById("header-search") ||
          document.getElementById("mobile-search");
        searchInput?.focus();
        if (window.innerWidth < 768) {
          setMobileSearchOpen(true);
        }
      }
    };

    document.addEventListener("keydown", keyboardHandler);
    return () => document.removeEventListener("keydown", keyboardHandler);
  }, []);

  // ✅ Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between h-16 md:h-20 px-4 sm:px-6 md:px-8 border-b border-border-default bg-surface-secondary/80 backdrop-blur-md">
        {/* LEFT */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-surface-tertiary transition active:scale-95"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X size={20} className="text-content-primary" />
            ) : (
              <Menu size={20} className="text-content-primary" />
            )}
          </button>

          {/* Desktop Sidebar Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:block p-2 rounded-md hover:bg-surface-tertiary transition active:scale-95"
            aria-label="Toggle sidebar"
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 text-content-primary ${
                isCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Desktop Search */}
          <div className="relative hidden md:block max-w-md w-full group">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
            />

            <input
              id="header-search"
              type="text"
              placeholder="Search..."
              className="w-full bg-surface-secondary/50 border border-border-default py-2.5 pl-12 pr-14 rounded-2xl text-sm outline-none 
              focus:bg-surface-card focus:border-primary-600 focus:ring-2 focus:ring-primary-200 
              transition-all text-content-primary placeholder:text-content-muted"
            />

            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 px-2 py-1 border border-border-default rounded-lg shadow-sm bg-surface-tertiary">
              <Command size={10} />
              <span className="text-[10px] font-bold">K</span>
            </div>
          </div>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-2 rounded-md hover:bg-surface-tertiary transition active:scale-95"
            aria-label="Toggle search"
          >
            <Search size={18} className="text-content-primary" />
          </button>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* 🌙 Dark Mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-tertiary border border-border-default transition active:scale-95 cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun size={16} className="text-content-primary" />
            ) : (
              <Moon size={16} className="text-content-primary" />
            )}
          </button>

          {/* 🔔 Notifications */}
          <div ref={notificationRef} className="relative hidden sm:block">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-tertiary border border-border-default transition active:scale-95 cursor-pointer"
              aria-label="Notifications"
            >
              <Bell size={16} className="text-content-primary" />
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-surface-card border border-border-default rounded-xl shadow-lg p-4 z-50">
                <h4 className="text-sm font-semibold mb-2 text-content-primary">
                  Notifications
                </h4>
                <p className="text-xs text-content-muted">
                  No new notifications
                </p>
              </div>
            )}
          </div>

          {/* 👤 Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full  hover:bg-surface-tertiary border border-border-default transition active:scale-95 cursor-pointer"
              aria-label="User profile"
            >
              <div className="w-6 h-6 bg-primary-600 flex items-center justify-center rounded-full ">
                <User size={16} className="text-content-inverse" />
              </div>
              <div className="hidden text-left sm:flex-col sm:flex ">
                <p className="text-xs font-medium leading-none text-content-primary">
                  Shohag Miah
                </p>
                <span className="text-[10px] text-content-muted">Admin</span>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-surface-card border border-border-default rounded-xl shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-border-default">
                  <p className="text-sm font-medium text-content-primary">
                    Shohag Miah
                  </p>
                  <p className="text-xs text-content-muted">Admin</p>
                </div>

                <button className="w-full text-left px-4 py-2 text-sm text-content-primary hover:bg-surface-tertiary transition">
                  Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-content-primary hover:bg-surface-tertiary transition">
                  Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-error-solid hover:bg-error-subtle transition">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden sticky top-16 z-30 bg-surface-secondary border-b border-border-default p-4 animate-slide-down">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
            />
            <input
              id="mobile-search"
              type="text"
              placeholder="Search..."
              autoFocus
              className="w-full bg-surface-primary border border-border-default py-2.5 pl-12 pr-4 rounded-xl text-sm outline-none 
              focus:border-primary-600 focus:ring-2 focus:ring-primary-200 
              transition-all text-content-primary placeholder:text-content-muted"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
