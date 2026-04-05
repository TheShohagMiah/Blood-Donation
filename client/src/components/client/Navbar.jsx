import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Droplet, LogIn, UserPlus } from "lucide-react";
import Button from "../../ui/Button";
import ThemeToggle from "../../ui/ThemeToggle";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar, closeSidebar } from "../../redux/slices/uiSlice";

const Navbar = () => {
  const { isSidebarOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // 1. Sync mobile menu with route changes
  useEffect(() => {
    dispatch(closeSidebar());
  }, [location.pathname, dispatch]);

  // 2. Optimized Scroll Observer
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        {/* Brand/Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-[var(--color-primary-600)] p-2 rounded-xl group-hover:rotate-[15deg] transition-all duration-300 shadow-lg shadow-red-500/20">
            <Droplet size={20} className="text-white fill-current" />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter text-[var(--color-content-primary)]">
            Life<span className="text-[var(--color-primary-600)]">Flow</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300
                    ${
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
            <div className="flex gap-2">
              <Link to="/login">
                <Button
                  variant="secondary"
                  className="h-8 px-4 text-[10px] font-black uppercase tracking-widest"
                >
                  <LogIn size={14} className="mr-2" /> Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  variant="primary"
                  className="h-8 px-2 text-[10px] font-black uppercase tracking-widest"
                >
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Control Group */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            className="p-2.5 rounded-xl bg-[var(--color-surface-muted)] text-[var(--color-content-primary)] hover:scale-105 active:scale-95 transition-all"
            onClick={() => dispatch(toggleSidebar())}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 top-[70px] bg-surface-card z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-6 h-full flex flex-col justify-between pb-20 overflow-y-auto">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center justify-between p-5 text-sm font-black uppercase tracking-widest hover:border-[var(--color-primary-600)] transition-all"
                  >
                    {link.name}
                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary-600)] opacity-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-3 pt-6 border-t border-[var(--color-border-default)]">
              <Link to="/login" className="block">
                <Button
                  variant="secondary"
                  className="w-full h-14 font-black uppercase text-[11px] tracking-widest"
                >
                  Sign In to Terminal
                </Button>
              </Link>
              <Link to="/register" className="block">
                <Button
                  variant="primary"
                  className="w-full h-14 font-black uppercase text-[11px] tracking-widest shadow-xl shadow-red-500/10"
                >
                  Create Donor Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
