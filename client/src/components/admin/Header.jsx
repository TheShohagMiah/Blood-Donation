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
  const location = useLocation();

  // generate abbrivation in words
  const getAbbreviation = (name) => {
    if (!name) return "S";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const abbreviation = getAbbreviation(user?.name);
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
      <header className="sticky top-0 z-40 flex items-center justify-between h-16 md:h-20 px-3 sm:px-4 md:px-6 border-b border-[var(--color-border-default)] bg-[var(--color-surface-main)]/80 backdrop-blur-md">
        {/* LEFT */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
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

          {/* Breadcrumb (hide on small screens) */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--color-content-muted)] truncate">
            <span className="hover:text-[var(--color-primary-600)] cursor-pointer transition-colors">
              Console
            </span>
          </div>
        </div>

        {/* MOBILE SEARCH OVERLAY */}
        {mobileSearchOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4">
            <div className="relative w-full max-w-md">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-content-muted)]"
              />
              <input
                autoFocus
                id="mobile-header-search"
                type="text"
                placeholder="Search commands..."
                className="w-full bg-[var(--color-surface-muted)] border border-transparent py-3 pl-12 pr-14 rounded-xl text-sm outline-none focus:border-[var(--color-primary-600)] focus:bg-[var(--color-surface-main)] transition-all"
              />
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[var(--color-content-muted)] hover:bg-[var(--color-surface-muted)] rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* DESKTOP SEARCH */}
        <div className="relative hidden md:block max-w-xs lg:max-w-md w-full mx-2 lg:mx-8 border border-border-default rounded-full">
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
          <div className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1 px-1.5 py-1 rounded bg-[var(--color-surface-main)] border border-[var(--color-border-default)]">
            <Command size={10} className="text-[var(--color-content-muted)]" />
            <span className="text-[9px] font-black text-[var(--color-content-muted)]">
              K
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Theme Toggle */}
          <button onClick={() => setDarkMode(!darkMode)} className="p-2">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <div ref={notificationRef} className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="p-2 sm:p-2.5 rounded-xl border border-[var(--color-border-default)] hover:bg-[var(--color-surface-muted)] transition-all text-[var(--color-content-primary)] relative"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-primary-600)] rounded-full border-2 border-[var(--color-surface-main)]" />
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-3 w-72 sm:w-80 max-w-[90vw] bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-top-2">
                <div className="p-4 border-b border-[var(--color-border-default)] flex justify-between items-center">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest">
                    Notifications
                  </h4>
                  <span className="text-[10px] text-[var(--color-primary-600)] font-bold cursor-pointer">
                    Clear All
                  </span>
                </div>
                <div className="p-6 sm:p-8 text-center">
                  <p className="text-xs text-[var(--color-content-muted)]">
                    System is running smoothly. No new alerts.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 sm:gap-3 pl-1 pr-2 sm:pr-3 py-1 rounded-full border border-[var(--color-border-default)] hover:border-[var(--color-primary-600)] transition-all bg-[var(--color-surface-muted)]/50"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary-600)] flex items-center justify-center text-white font-bold text-xs">
                {abbreviation}
              </div>

              {/* Hide text on very small screens */}
              <div className="hidden sm:block text-left max-w-[120px] truncate">
                <p className="text-xs font-bold text-[var(--color-content-primary)] leading-none truncate">
                  {user.name}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-tighter text-[var(--color-primary-600)] mt-0.5">
                  {user?.role}
                </p>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-52 sm:w-56 bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-2xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-[var(--color-border-default)]">
                  <p className="text-xs font-bold">Signed in as</p>
                  <p className="text-xs text-[var(--color-content-muted)] truncate">
                    {user?.email}
                  </p>
                </div>

                <Link
                  onClick={() => setProfileOpen(false)}
                  to="/dashboard/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-[var(--color-surface-muted)] transition-colors"
                >
                  <User size={14} /> My Profile
                </Link>

                <Link
                  onClick={() => setProfileOpen(false)}
                  to="/dashboard/settings"
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
