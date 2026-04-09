import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Menu,
  X,
  Droplet,
  LogIn,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  UserPlus,
} from "lucide-react";

import Button from "../../ui/Button";
import ThemeToggle from "../../ui/ThemeToggle";
import { toggleSidebar, closeSidebar } from "../../redux/slices/uiSlice";
import { logout } from "../../redux/slices/authSlice";
import { useLogoutMutation } from "../../redux/features/isAuth/authApi";

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { isSidebarOpen } = useSelector((state) => state.ui);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userLogoutFromServer, { isLoading }] = useLogoutMutation();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    dispatch(closeSidebar());
    setIsProfileOpen(false);
  }, [location.pathname, dispatch]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await userLogoutFromServer();
      dispatch(logout());
      navigate("/login", { replace: true });
    } catch (error) {}
  };
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Find Donors", path: "/find-donors" },
    { name: "Requests", path: "/requests" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-500 border-b 
      ${
        isScrolled
          ? "bg-[var(--color-surface-card)]/90 backdrop-blur-xl border-[var(--color-border-default)] py-3 shadow-md"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-[var(--color-primary-600)] p-2 rounded-xl group-hover:rotate-[12deg] transition-transform duration-300">
            <Droplet size={20} className="text-white fill-current" />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter text-[var(--color-content-primary)]">
            Life<span className="text-[var(--color-primary-600)]">Flow</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                    location.pathname === link.path
                      ? "text-[var(--color-primary-600)]"
                      : "text-[var(--color-content-muted)] hover:text-[var(--color-content-primary)]"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="h-5 w-[1px] bg-[var(--color-border-default)]" />

          <div className="flex items-center gap-4">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="relative group focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-md border-2 border-[var(--color-border-default)] overflow-hidden group-hover:border-[var(--color-primary-600)] transition-all duration-300">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[var(--color-surface-muted)] flex items-center justify-center text-[11px] font-black text-[var(--color-content-primary)]">
                        <User size={18} />
                      </div>
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-md shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 border-b border-[var(--color-border-default)] mb-1">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
                        Signed in as
                      </p>
                      <p className="text-[11px] font-bold text-[var(--color-content-primary)] truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-[var(--color-content-muted)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-surface-muted)] transition-all"
                    >
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-[var(--color-content-muted)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-surface-muted)] transition-all"
                    >
                      <Settings size={15} /> System Settings
                    </Link>

                    <div className="my-1 border-t border-[var(--color-border-default)]" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-all"
                    >
                      <LogOut size={15} /> Terminate Session
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login">
                  <Button
                    variant="primary"
                    className="h-8 px-4 text-[10px] font-black uppercase tracking-widest"
                  >
                    <LogIn size={14} className="mr-2" /> Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="secondary"
                    className="h-8 px-4 text-[10px] font-black uppercase tracking-widest"
                  >
                    <UserPlus size={14} className="mr-2" /> Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2.5 rounded-xl bg-[var(--color-surface-muted)] text-[var(--color-content-primary)]"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
