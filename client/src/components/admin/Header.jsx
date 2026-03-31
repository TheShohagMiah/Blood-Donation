import React, { useEffect, useRef, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Command,
  Menu,
  Moon,
  Search,
  Sun,
  User,
  X,
  LogOut,
  Settings,
  ChevronRight,
} from "lucide-react";
import { useLogoutMutation } from "../../redux/features/isAuth/authApi";
import { logout } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const Header = ({
  isCollapsed,
  setIsCollapsed,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const [userLogoutFromServer, { isLoading }] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const location = useLocation();

  // Generate Breadcrumbs from URL
  const pathnames = location.pathname.split("/").filter((x) => x);

  useEffect(() => {
    const outSideClickHandler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      )
        setNotificationOpen(false);
    };
    document.addEventListener("mousedown", outSideClickHandler);
    return () => document.removeEventListener("mousedown", outSideClickHandler);
  }, []);

  useEffect(() => {
    const keyboardHandler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("header-search")?.focus();
        if (window.innerWidth < 768) setMobileSearchOpen(true);
      }
    };
    document.addEventListener("keydown", keyboardHandler);
    return () => document.removeEventListener("keydown", keyboardHandler);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await userLogoutFromServer();
      dispatch(logout());
      navigate("/login", { replace: true });
    } catch (error) {}
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between h-20 px-6 border-b border-[var(--color-border-default)] bg-[var(--color-surface-main)]/80 backdrop-blur-md">
        {/* LEFT: Menu & Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              window.innerWidth < 768
                ? setIsMobileMenuOpen(!isMobileMenuOpen)
                : setIsCollapsed(!isCollapsed)
            }
            className="p-2 rounded-lg hover:bg-[var(--color-surface-muted)] transition-colors text-[var(--color-content-primary)]"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--color-content-muted)]">
            <span className="hover:text-[var(--color-primary-600)] cursor-pointer transition-colors">
              Console
            </span>
            {pathnames.map((name, index) => (
              <React.Fragment key={index}>
                <ChevronRight size={12} className="opacity-40" />
                <span
                  className={
                    index === pathnames.length - 1
                      ? "text-[var(--color-primary-600)]"
                      : ""
                  }
                >
                  {name.replace("-", " ")}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* CENTER: Industrial Search */}
        <div className="relative hidden md:block max-w-md w-full mx-8 border border-border-default rounded-full">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-content-muted)]"
          />
          <input
            id="header-search"
            type="text"
            placeholder="Search commands..."
            className="w-full bg-[var(--color-surface-muted)] border border-transparent py-2.5 pl-12 pr-14 rounded-xl text-xs outline-none focus:border-[var(--color-primary-600)] focus:bg-[var(--color-surface-main)] transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-1 rounded bg-[var(--color-surface-main)] border border-[var(--color-border-default)]">
            <Command size={10} className="text-[var(--color-content-muted)]" />
            <span className="text-[9px] font-black text-[var(--color-content-muted)]">
              K
            </span>
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl border border-[var(--color-border-default)] hover:bg-[var(--color-surface-muted)] transition-all text-[var(--color-content-primary)]"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <div ref={notificationRef} className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="p-2.5 rounded-xl border border-[var(--color-border-default)] hover:bg-[var(--color-surface-muted)] transition-all text-[var(--color-content-primary)] relative"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--color-primary-600)] rounded-full border-2 border-[var(--color-surface-main)]" />
            </button>
            {notificationOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-top-2">
                <div className="p-4 border-b border-[var(--color-border-default)] flex justify-between items-center">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest">
                    Notifications
                  </h4>
                  <span className="text-[10px] text-[var(--color-primary-600)] font-bold cursor-pointer">
                    Clear All
                  </span>
                </div>
                <div className="p-8 text-center">
                  <p className="text-xs text-[var(--color-content-muted)]">
                    System is running smoothly. No new alerts.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div ref={profileRef} className="relative ml-2">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full border border-[var(--color-border-default)] hover:border-[var(--color-primary-600)] transition-all bg-[var(--color-surface-muted)]/50"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary-600)] flex items-center justify-center text-white font-bold text-xs">
                SM
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-[var(--color-content-primary)] leading-none">
                  Shohag Miah
                </p>
                <p className="text-[9px] font-bold uppercase tracking-tighter text-[var(--color-primary-600)] mt-0.5">
                  Administrator
                </p>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-2xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-[var(--color-border-default)]">
                  <p className="text-xs font-bold">Signed in as</p>
                  <p className="text-xs text-[var(--color-content-muted)] truncate">
                    shohag.miah@lifeflow.com
                  </p>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-[var(--color-surface-muted)] transition-colors"
                >
                  <User size={14} /> My Profile
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-[var(--color-surface-muted)] transition-colors"
                >
                  <Settings size={14} /> Console Settings
                </Link>
                <div className="h-px bg-[var(--color-border-default)] my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
