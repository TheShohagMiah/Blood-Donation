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
} from "lucide-react";
import { useLogoutMutation } from "../../redux/features/isAuth/authApi";
import { logout } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

const Header = ({
  isCollapsed,
  setIsCollapsed,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const [userLogoutFromServer, { isLoading }] = useLogoutMutation();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const location = useLocation();

  const getAbbreviation = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  const abbreviation = getAbbreviation(user?.name);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      )
        setNotificationOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ⌘K / Ctrl+K opens search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (window.innerWidth >= 1024) {
          document.getElementById("header-search")?.focus();
        } else {
          setMobileSearchOpen(true);
        }
      }
      if (e.key === "Escape") {
        setMobileSearchOpen(false);
        setProfileOpen(false);
        setNotificationOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Auto-focus mobile search input when opened
  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => mobileSearchRef.current?.focus(), 50);
    }
  }, [mobileSearchOpen]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Close mobile search & profile on route change
  useEffect(() => {
    setMobileSearchOpen(false);
    setProfileOpen(false);
    setNotificationOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await userLogoutFromServer();
      dispatch(logout());
      navigate("/login", { replace: true });
    } catch {}
  };

  // Shared dropdown button styles
  const iconBtnClass =
    "p-2 rounded-md border border-[var(--color-border-default)] hover:bg-[var(--color-surface-muted)] transition-all text-[var(--color-content-primary)]";

  return (
    <>
      {/* ── Mobile Search Overlay ── */}
      {mobileSearchOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileSearchOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg animate-in fade-in slide-in-from-top-4 duration-200">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-content-muted)] pointer-events-none"
            />
            <input
              ref={mobileSearchRef}
              type="text"
              placeholder="Search commands..."
              className="w-full bg-[var(--color-surface-card)] border border-[var(--color-border-default)] py-3.5 pl-12 pr-12 rounded-2xl text-sm outline-none focus:border-[var(--color-primary-600)] shadow-2xl transition-all"
            />
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[var(--color-content-muted)] hover:bg-[var(--color-surface-muted)] rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-3 sm:px-4 lg:px-6 border-b border-[var(--color-border-default)] bg-[var(--color-surface-main)]/80 backdrop-blur-md">
        {/* ── LEFT: Menu toggle + breadcrumb ── */}
        <div className="flex items-center gap-2 min-w-0">
          {/*
            NOTE: The hamburger/collapse button in the sidebar header handles
            toggling. This button mirrors it for cases where the sidebar header
            isn't visible (e.g. fully collapsed). You can remove it if the
            sidebar already has a close/open control.
          */}
          <button
            onClick={() =>
              window.innerWidth < 1024
                ? setIsMobileMenuOpen((v) => !v)
                : setIsCollapsed((v) => !v)
            }
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-surface-muted)] transition-colors text-[var(--color-content-primary)]"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-content-muted)] pointer-events-none"
              />
              <input
                id="header-search"
                type="text"
                placeholder="Search commands..."
                className="w-full bg-[var(--color-surface-muted)] border border-transparent py-2.5 pl-11 pr-16 rounded-md text-xs outline-none focus:border-[var(--color-primary-600)] focus:bg-[var(--color-surface-main)] transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-1 rounded-md bg-[var(--color-surface-main)] border border-[var(--color-border-default)] pointer-events-none">
                <Command
                  size={10}
                  className="text-[var(--color-content-muted)]"
                />
                <span className="text-[9px] font-black text-[var(--color-content-muted)]">
                  K
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── CENTER: Desktop search ── */}

        {/* ── RIGHT: actions ── */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Search icon — mobile & tablet only */}
          <button
            onClick={() => setMobileSearchOpen(true)}
            className={`lg:hidden ${iconBtnClass}`}
            aria-label="Open search"
          >
            <Search size={18} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setDarkMode((v) => !v)}
            className={iconBtnClass}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun size={18} className="text-amber-400" />
            ) : (
              <Moon size={18} />
            )}
          </button>

          {/* Notifications */}
          <div ref={notificationRef} className="relative">
            <button
              onClick={() => {
                setNotificationOpen((v) => !v);
                setProfileOpen(false);
              }}
              className={`relative ${iconBtnClass}`}
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-primary-600)] rounded-full border-2 border-[var(--color-surface-main)]" />
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-3 w-72 sm:w-80 max-w-[calc(100vw-1rem)] bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-[var(--color-border-default)] flex justify-between items-center">
                  <h4 className="text-[11px] font-black uppercase tracking-widest">
                    Notifications
                  </h4>
                  <button className="text-[10px] text-[var(--color-primary-600)] font-bold hover:opacity-70 transition-opacity">
                    Clear All
                  </button>
                </div>
                <div className="py-8 text-center">
                  <Bell
                    size={28}
                    className="mx-auto mb-3 text-[var(--color-content-muted)] opacity-20"
                  />
                  <p className="text-xs text-[var(--color-content-muted)]">
                    No new notifications
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => {
                setProfileOpen((v) => !v);
                setNotificationOpen(false);
              }}
              className="flex items-center gap-2 pl-1 pr-2 sm:pr-3 py-1 rounded-full border border-[var(--color-border-default)] hover:border-[var(--color-primary-600)] transition-all bg-[var(--color-surface-muted)]/50"
              aria-label="Profile menu"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary-600)] flex items-center justify-center text-white font-bold text-xs shrink-0">
                {abbreviation}
              </div>
              {/* Name + role — hidden on small screens */}
              <div className="hidden sm:block text-left max-w-[110px]">
                <p className="text-xs font-bold text-[var(--color-content-primary)] leading-none truncate">
                  {user?.name}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-tighter text-[var(--color-primary-600)] mt-0.5">
                  {user?.role}
                </p>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-52 sm:w-56 max-w-[calc(100vw-1rem)] bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                {/* User info */}
                <div className="px-4 py-3 border-b border-[var(--color-border-default)]">
                  <p className="text-[11px] font-black uppercase tracking-widest text-[var(--color-content-muted)] mb-1">
                    Signed in as
                  </p>
                  <p className="text-xs font-bold text-[var(--color-content-primary)] truncate">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-[var(--color-content-muted)] truncate">
                    {user?.email}
                  </p>
                </div>

                <Link
                  to="/dashboard/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium hover:bg-[var(--color-surface-muted)] transition-colors"
                >
                  <User size={14} className="shrink-0" /> My Profile
                </Link>
                <Link
                  to="/dashboard/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium hover:bg-[var(--color-surface-muted)] transition-colors"
                >
                  <Settings size={14} className="shrink-0" /> Console Settings
                </Link>

                <div className="h-px bg-[var(--color-border-default)] my-1" />

                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <LogOut size={14} className="shrink-0" />
                  {isLoading ? "Signing out…" : "Sign Out"}
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
