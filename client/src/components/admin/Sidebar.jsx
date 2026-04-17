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
  admin: "bg-purple-50 text-purple-600 border-purple-300",
  volunteer: "bg-blue-50 text-blue-600 border-blue-300",
  donor: "bg-emerald-50 text-emerald-600 border-emerald-300",
};

const getFilteredNav = (links, userRole) => {
  return links
    .filter((link) => link.roles.includes(userRole))
    .map((link) => {
      if (link.subMenu) {
        return {
          ...link,
          subMenu: link.subMenu.filter((sub) => sub.roles.includes(userRole)),
        };
      }
      return link;
    })
    .filter((link) => !link.subMenu || link.subMenu.length > 0);
};

const Sidebar = ({
  isCollapsed,
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

  // ✅ Fix 1: wire up logout
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

  const toggleSubMenu = (i) => {
    setIsSubMenuOpen(isSubMenuOpen === i ? null : i);
  };

  useEffect(() => {
    if (isCollapsed) setIsSubMenuOpen(null);
  }, [isCollapsed, setIsSubMenuOpen]);

  // ✅ Fix 3: close mobile menu on navigation
  const handleNavClick = () => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const activeClass =
    "bg-[var(--color-primary-600)] text-white shadow-md shadow-[var(--color-primary-subtle)]";
  const inactiveClass =
    "text-[var(--color-content-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-content-primary)]";
  const labelStyle = "text-[11px] font-semibold uppercase tracking-[0.15em]";

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`
    fixed inset-y-0 left-0 z-50
    flex flex-col
    transition-transform duration-300 ease-in-out
    border-r border-[var(--color-border-default)] bg-[var(--color-surface-card)]
    ${isCollapsed ? "w-20" : "w-72"}
    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `}
      >
        <div className="flex flex-col h-full min-h-0">
          {/* HEADER */}
          <div className="flex items-center justify-between h-20 px-4 md:px-6 border-b border-[var(--color-border-default)]">
            <div className="flex items-center gap-3 overflow-hidden min-w-0">
              <div className="bg-[var(--color-primary-600)] p-2 rounded-xl shadow-lg shadow-red-500/20 shrink-0">
                <Droplet size={20} className="text-white fill-current" />
              </div>

              {!isCollapsed && (
                <div className="min-w-0">
                  <span className="text-xl font-black uppercase tracking-tighter text-[var(--color-content-primary)] block truncate">
                    Life{" "}
                    <span className="text-[var(--color-primary-600)]">
                      Flow
                    </span>
                  </span>

                  <p
                    className={`text-[8px] font-bold px-3 py-1 rounded-lg border w-fit capitalize mt-1 ${
                      ROLE_BADGE_STYLES[user?.role] ||
                      "bg-slate-50 text-slate-600 border-slate-300"
                    }`}
                  >
                    {user?.role}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-2 rounded-md hover:bg-[var(--color-surface-muted)] transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* NAVIGATION */}
          <nav className="p-3 md:p-4 space-y-3 overflow-y-auto flex-1 min-h-0 custom-scrollbar">
            {filteredLinks.map((item, i) => {
              const isParentActive = item?.subMenu?.some(
                (sub) => location.pathname === sub.path,
              );

              const isOpen = isSubMenuOpen === i;

              return (
                <div key={i} className="space-y-1">
                  {/* PARENT ITEM */}
                  {item.subMenu ? (
                    <>
                      <button
                        onClick={() => toggleSubMenu(i)}
                        className={`
                    w-full flex items-center gap-4 px-3 py-2.5 rounded-sm
                    transition-all
                    ${isParentActive ? activeClass : inactiveClass}
                  `}
                      >
                        <item.icon size={20} className="shrink-0" />

                        {!isCollapsed && (
                          <>
                            <span
                              className={`${labelStyle} flex-1 text-left truncate`}
                            >
                              {item.name}
                            </span>

                            <ChevronDown
                              size={14}
                              className={`transition-transform duration-300 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </>
                        )}
                      </button>

                      {/* SUBMENU */}
                      <AnimatePresence>
                        {isOpen && !isCollapsed && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden ml-5 border-l border-[var(--color-border-default)] pl-3 space-y-1"
                          >
                            {item.subMenu.map((sub, subIdx) => (
                              <NavLink
                                end
                                key={subIdx}
                                to={sub.path}
                                onClick={handleNavClick}
                                className={({ isActive }) => `
                            block px-3 py-2 rounded-md text-[13px] transition-all
                            ${
                              isActive
                                ? "text-[var(--color-primary-600)] font-semibold border-l-2 border-[var(--color-primary-600)] pl-3"
                                : "text-[var(--color-content-muted)] hover:text-[var(--color-content-primary)]"
                            }
                          `}
                              >
                                {sub.name}
                              </NavLink>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    /* SINGLE LINK */
                    <NavLink
                      end
                      to={item.path}
                      onClick={handleNavClick}
                      className={({ isActive }) => `
                  flex items-center gap-4 px-3 py-2 rounded-sm transition-all
                  ${isActive ? activeClass : inactiveClass}
                `}
                    >
                      <item.icon size={20} className="shrink-0" />

                      {!isCollapsed && (
                        <span className={`${labelStyle} truncate`}>
                          {item.name}
                        </span>
                      )}
                    </NavLink>
                  )}
                </div>
              );
            })}
          </nav>

          {/* FOOTER */}
          {!isCollapsed && (
            <div className="border-t border-[var(--color-border-default)] p-4 md:p-5">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-3 bg-red-300 px-4 py-2 rounded-sm font-bold text-sm border border-red-400 text-red-700 w-full transition-colors disabled:opacity-50"
              >
                <LogOut size={18} />
                {isLoggingOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
