import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Droplet, Moon, Sun, LogIn, UserPlus } from "lucide-react";
import Button from "../../ui/Button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  // 1. Close mobile menu automatically when the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // 2. Optimized scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        if (!isScrolled) setIsScrolled(true);
      } else {
        if (isScrolled) setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  const navLinks = [
    { name: "Find Donors", path: "/find-donors" },
    { name: "Requests", path: "/requests" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b 
      ${
        isScrolled
          ? "bg-[var(--color-surface-card)]/80 backdrop-blur-md border-[var(--color-border-default)] py-3 shadow-sm"
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-[var(--color-primary-600)] p-1.5 rounded-lg group-hover:scale-110 transition-transform">
            <Droplet size={22} className="text-white fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--color-content-primary)]">
            Life<span className="text-[var(--color-primary-600)]">Flow</span>
          </span>
        </Link>

        {/* Right: Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`text-[11px] font-bold uppercase tracking-[0.12em] transition-colors
                    ${
                      location.pathname === link.path
                        ? "text-[var(--color-primary-600)]"
                        : "text-[var(--color-content-muted)] hover:text-[var(--color-primary-600)]"
                    }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="h-6 w-[1px] bg-[var(--color-border-default)]" />

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-[var(--color-content-muted)] hover:bg-[var(--color-surface-muted)] rounded-full transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="flex gap-2">
              <Link to="/login">
                <Button variant="ghost" className="h-9 px-4">
                  <span className="flex items-center gap-2">
                    <LogIn size={14} /> Sign In
                  </span>
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" className="h-9 px-4">
                  <span className="flex items-center gap-2">
                    <UserPlus size={14} /> Sign Up
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile: Toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-[var(--color-content-primary)] hover:bg-[var(--color-surface-muted)] transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-[100%] h-screen bg-[var(--color-surface-card)] border-b border-[var(--color-border-default)] p-6 space-y-8 animate-in slide-in-from-top-2 duration-300">
          <ul className="space-y-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="block text-lg font-bold uppercase tracking-widest text-[var(--color-content-primary)]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="pt-8 border-t border-[var(--color-border-default)] flex flex-col gap-4">
            <Link to="/login" className="w-full">
              <Button variant="secondary" className="w-full h-12">
                Sign In
              </Button>
            </Link>
            <Link to="/register" className="w-full">
              <Button variant="primary" className="w-full h-12">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
