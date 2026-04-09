import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Droplet, LogOut, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "../../data/navLinks";
import { useSelector } from "react-redux";

const getFilteredNav = (links, userRole) => {
  return (
    links
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
      // Ensure parent categories with empty subMenus (after filtering) are removed
      .filter((link) => !link.subMenu || link.subMenu.length > 0)
  );
};

const Sidebar = ({
  isCollapsed,
  isSubMenuOpen,
  setIsSubMenuOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  userRole,
}) => {
  const location = useLocation();

  const toggleSubMenu = (i) => {
    setIsSubMenuOpen(isSubMenuOpen === i ? null : i);
  };

  const { user } = useSelector((state) => state.auth);
  const filteredLinks = getFilteredNav(navLinks, user?.role);
  // ✅ Auto close submenu when collapsed to prevent floating menus
  useEffect(() => {
    if (isCollapsed) setIsSubMenuOpen(null);
  }, [isCollapsed, setIsSubMenuOpen]);

  // ✅ UI Helpers for cleaner JSX
  const activeClass =
    "bg-[var(--color-primary-600)] text-white shadow-md shadow-[var(--color-primary-subtle)]";
  const inactiveClass =
    "text-[var(--color-content-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-content-primary)]";
  const labelStyle = "text-[11px] font-bold uppercase tracking-[0.15em]";

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
          transition-all duration-300 ease-in-out 
          border-r border-[var(--color-border-default)] bg-[var(--color-surface-card)]
          ${isCollapsed ? "w-20" : "w-72"}
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-[var(--color-border-default)]">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-[var(--color-primary-600)] p-2 rounded-xl group-hover:rotate-[15deg] transition-all duration-300 shadow-lg shadow-red-500/20">
                <Droplet size={20} className="text-white fill-current" />
              </div>
              {!isCollapsed && (
                <div className="">
                  <span className="text-xl font-black uppercase tracking-tighter text-[var(--color-content-primary)]">
                    Life
                    <span className="text-[var(--color-primary-600)]">
                      Flow
                    </span>
                  </span>

                  <p className="text-[8px] font-bold bg-primary-50 text-primary-600 px-4 py-1 rounded-lg border border-primary-600 w-fit capitalize">
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

          {/* Navigation */}
          <nav className="p-4 space-y-2 overflow-y-auto flex-1 custom-scrollbar">
            {filteredLinks.map((item, i) => {
              const isParentActive = item?.subMenu?.some(
                (sub) => location.pathname === sub.path,
              );
              const isOpen = isSubMenuOpen === i;

              return (
                <div key={i} className="space-y-1">
                  {item.subMenu ? (
                    <>
                      <button
                        onClick={() => toggleSubMenu(i)}
                        className={`
                          w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all group
                          ${isParentActive || isOpen ? "text-[var(--color-primary-600)] bg-[var(--color-primary-50)]/50" : inactiveClass}
                        `}
                      >
                        <item.icon size={20} className="shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className={`${labelStyle} flex-1 text-left`}>
                              {item.name}
                            </span>
                            <ChevronDown
                              size={14}
                              className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                            />
                          </>
                        )}
                      </button>

                      <AnimatePresence>
                        {isOpen && !isCollapsed && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden ml-5 border-l border-[var(--color-border-default)] pl-4 space-y-1"
                          >
                            {item.subMenu.map((sub, subIdx) => (
                              <NavLink
                                key={subIdx}
                                to={sub.path}
                                className={({ isActive }) => `
                                  block px-3 py-2 text-[13px] rounded-md transition-all
                                  ${isActive ? "text-[var(--color-primary-600)] font-bold bg-[var(--color-primary-50)]" : "text-[var(--color-content-muted)] hover:text-[var(--color-content-primary)]"}
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
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center gap-4 px-3 py-3 rounded-lg transition-all
                        ${isActive ? activeClass : inactiveClass}
                      `}
                    >
                      <item.icon size={20} className="shrink-0" />
                      {!isCollapsed && (
                        <span className={labelStyle}>{item.name}</span>
                      )}
                    </NavLink>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer Info */}
          {!isCollapsed && (
            <div className=" border-t border-[var(--color-border-default)] p-5">
              <button className="flex items-center gap-3 bg-red-50 px-4 py-2 rounded-sm font-bold text-sm border border-red-600 text-red-500 w-full">
                <LogOut />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
