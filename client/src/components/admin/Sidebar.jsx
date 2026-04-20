import React, { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Droplet, LogOut, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "../../data/navLinks";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/features/isAuth/authApi";
import { logout as logoutAction } from "../../redux/slices/authSlice";
import { toast } from "react-hot-toast";

const ROLE_BADGE_STYLES = {
  admin: "bg-purple-100 text-purple-700 border-purple-200",
  volunteer: "bg-blue-100 text-blue-700 border-blue-200",
  donor: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const getFilteredNav = (links, userRole) => {
  return links
    .filter((link) => link.roles.includes(userRole))
    .map((link) => ({
      ...link,
      subMenu: link.subMenu?.filter((sub) => sub.roles.includes(userRole)),
    }))
    .filter((link) => !link.subMenu || link.subMenu.length > 0);
};

const Sidebar = ({
  isSubMenuOpen,
  setIsSubMenuOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const filteredLinks = getFilteredNav(navLinks, user?.role);

  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logoutAction());
      navigate("/login");
    } catch {
      toast.error("Failed to log out. Please try again.");
    }
  };

  const toggleSubMenu = (i) => setIsSubMenuOpen(isSubMenuOpen === i ? null : i);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, setIsMobileMenuOpen]);

  const handleNavClick = () => setIsMobileMenuOpen(false);

  // ── Shared sidebar content (used in both desktop & mobile) ──
  const SidebarContent = () => (
    <div className="flex flex-col h-full min-h-0">
      {/* HEADER */}
      <div className="relative flex items-center justify-between h-16 px-5 border-b border-[var(--color-border-default)] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-[var(--color-primary-600)] p-2 rounded-md shadow-lg shadow-red-500/20 shrink-0">
            <Droplet size={18} className="text-white fill-current" />
          </div>
          <div className="min-w-0">
            <span className="text-lg font-black uppercase tracking-tighter text-[var(--color-content-primary)] block leading-none">
              Life <span className="text-[var(--color-primary-600)]">Flow</span>
            </span>
            <span
              className={`inline-block text-[8px] font-bold px-2 py-0.5 rounded-md border capitalize mt-1 ${
                ROLE_BADGE_STYLES[user?.role] ||
                "bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              {user?.role}
            </span>
          </div>
        </div>

        {/* Close button — only visible on mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] text-[var(--color-content-muted)] hover:text-[var(--color-content-primary)] transition-colors"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 min-h-0 custom-scrollbar">
        {filteredLinks.map((item, i) => {
          const isParentActive = item?.subMenu?.some(
            (sub) => location.pathname === sub.path,
          );
          const isOpen = isSubMenuOpen === i;

          return (
            <div key={i}>
              {item.subMenu ? (
                <>
                  <button
                    onClick={() => toggleSubMenu(i)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-md
                      transition-all duration-150
                      ${
                        isParentActive
                          ? "bg-[var(--color-primary-600)] text-white shadow-md shadow-[var(--color-primary-subtle)]"
                          : "text-[var(--color-content-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-content-primary)]"
                      }
                    `}
                  >
                    <item.icon size={17} className="shrink-0" />
                    <span className="flex-1 text-left text-[11px] font-semibold uppercase tracking-[0.12em] truncate">
                      {item.name}
                    </span>
                    <ChevronDown
                      size={13}
                      className={`shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 mt-0.5 mb-1 pl-3 border-l-2 border-[var(--color-border-default)] space-y-0.5">
                          {item.subMenu.map((sub, subIdx) => (
                            <NavLink
                              end
                              key={subIdx}
                              to={sub.path}
                              onClick={handleNavClick}
                              className={({ isActive }) => `
                                flex items-center gap-2 px-3 py-2 rounded-md text-[12px] font-medium transition-all
                                ${
                                  isActive
                                    ? "text-[var(--color-primary-600)] font-semibold bg-[var(--color-primary-600)]/8"
                                    : "text-[var(--color-content-muted)] hover:text-[var(--color-content-primary)] hover:bg-[var(--color-surface-muted)]"
                                }
                              `}
                            >
                              <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-current opacity-40" />
                              {sub.name}
                            </NavLink>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <NavLink
                  end
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-md
                    transition-all duration-150 text-[11px] font-semibold uppercase tracking-[0.12em]
                    ${
                      isActive
                        ? "bg-[var(--color-primary-600)] text-white shadow-md shadow-[var(--color-primary-subtle)]"
                        : "text-[var(--color-content-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-content-primary)]"
                    }
                  `}
                >
                  <item.icon size={17} className="shrink-0" />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              )}
            </div>
          );
        })}
      </nav>

      {/* USER CARD */}
      <div className="mx-3 my-4 px-4 py-3 rounded-md shadow-md shadow-inner bg-[var(--color-surface-muted)]/60 border border-[var(--color-border-default)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--color-primary-600)] flex items-center justify-center text-white text-xs font-black shrink-0">
            {user?.name
              ?.split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[var(--color-content-primary)] truncate leading-tight">
              {user?.name}
            </p>
            <p className="text-[10px] text-[var(--color-content-muted)] truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-3 border-t border-[var(--color-border-default)] shrink-0">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-md
                     bg-red-50 hover:bg-red-100 active:bg-red-200
                     border border-red-200 text-red-600
                     text-xs font-bold uppercase tracking-widest
                     transition-colors disabled:opacity-50"
        >
          <LogOut size={16} className="shrink-0" />
          <span>{isLoggingOut ? "Signing out…" : "Sign Out"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP: always visible on lg+ ── */}
      <aside
        className="hidden md:flex flex-col fixed inset-y-0 left-0 z-50 w-72
                        bg-[var(--color-surface-card)]
                        border-r border-[var(--color-border-default)]"
      >
        <SidebarContent />
      </aside>

      {/* ── MOBILE: animated slide-in below lg ── */}
      <>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.aside
              key="mobile-sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col
                         bg-[var(--color-surface-card)]
                         border-r border-[var(--color-border-default)]
                         shadow-2xl lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          )}
        </AnimatePresence>
      </>
    </>
  );
};

export default Sidebar;
