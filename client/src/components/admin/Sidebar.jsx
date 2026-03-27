import React, { useEffect } from "react";
import { navLinks } from "../../data/navLinks";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  const filterNavLinks = navLinks.filter((l) => l.roles.includes(userRole));

  const sidebarWidth = isCollapsed ? "md:w-20" : "md:w-72";

  // ✅ Auto close submenu when collapsed
  useEffect(() => {
    if (isCollapsed) setIsSubMenuOpen(null);
  }, [isCollapsed, setIsSubMenuOpen]);

  // ✅ Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, setIsMobileMenuOpen]);

  // ✅ Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 
        transition-all duration-300 ease-in-out 
        border-r border-border-default bg-surface-secondary
        ${sidebarWidth}
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        w-72
      `}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between h-16 md:h-20 px-4 sm:px-6 border-b border-border-default">
          <span className="text-base md:text-lg font-semibold tracking-tight whitespace-nowrap text-content-primary">
            {isCollapsed ? (
              <span className="hidden md:inline">A</span>
            ) : (
              "Admin Console"
            )}
          </span>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-2 rounded-md hover:bg-surface-tertiary transition"
            aria-label="Close menu"
          >
            <X size={20} className="text-content-primary" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 sm:p-4 space-y-1.5 sm:space-y-2 overflow-y-auto flex-1">
          {filterNavLinks.map((item, i) => {
            const isParentActive =
              item?.subMenu &&
              item.subMenu.some((sub) =>
                location.pathname.startsWith(sub.path),
              );

            return (
              <div key={i}>
                {item?.subMenu ? (
                  <>
                    {/* 🔽 Parent Button */}
                    <button
                      onClick={() => toggleSubMenu(i)}
                      className={`
                        relative flex items-center gap-3 md:gap-4 px-3 py-2.5 rounded-sm w-full
                        transition-all duration-200 group
                        ${
                          isParentActive
                            ? "bg-primary-600 text-primary-50 rounded-sm text-lg  font-medium border-l-4 border-primary-700"
                            : "text-content-secondary hover:bg-surface-tertiary hover:text-content-primary"
                        }
                      `}
                    >
                      <item.icon
                        className={`w-5 h-5 shrink-0 ${
                          isCollapsed ? "md:mx-auto" : ""
                        } ${
                          isParentActive
                            ? "text-primary-600"
                            : "text-content-secondary group-hover:text-primary-600"
                        }`}
                      />

                      {!isCollapsed && (
                        <>
                          <span className="text-sm tracking-wide flex-1 text-left">
                            {item.name}
                          </span>

                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${
                              isSubMenuOpen === i ? "rotate-180" : ""
                            }`}
                          />
                        </>
                      )}

                      {/* Mobile: Always show text */}
                      <span className="md:hidden text-sm tracking-wide flex-1 text-left">
                        {item.name}
                      </span>
                      <ChevronDown
                        className={`md:hidden w-4 h-4 transition-transform duration-300 ${
                          isSubMenuOpen === i ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* ✨ Submenu */}
                    <AnimatePresence>
                      {isSubMenuOpen === i && !isCollapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="ml-6 mt-2 space-y-1 border-l border-border-default pl-4">
                            {item.subMenu.map((sub, subIndex) => (
                              <NavLink
                                end
                                key={subIndex}
                                to={sub.path}
                                className={({ isActive }) => `
                                  block px-3 py-2 text-sm rounded-sm transition-all duration-200
                                  ${
                                    isActive
                                      ? "bg-primary-100 text-primary-600 border-r-2 border-primary-600 font-medium"
                                      : "text-content-secondary hover:bg-surface-tertiary hover:text-content-primary"
                                  }
                                `}
                              >
                                {sub.name}
                              </NavLink>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Mobile: Always show submenu when open */}
                      {isSubMenuOpen === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                          className="md:hidden overflow-hidden"
                        >
                          <div className="ml-6 mt-2 space-y-1 border-l border-border-default pl-4">
                            {item.subMenu.map((sub, subIndex) => (
                              <NavLink
                                end
                                key={subIndex}
                                to={sub.path}
                                className={({ isActive }) => `
                                  block px-3 py-2 rounded-md text-sm transition-all duration-200
                                  ${
                                    isActive
                                      ? "bg-primary-100 text-primary-600 font-medium"
                                      : "text-content-secondary hover:bg-surface-tertiary hover:text-content-primary"
                                  }
                                `}
                              >
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
                    onClick={() => setIsSubMenuOpen(null)}
                    end
                    to={item.path}
                    className={({ isActive }) => `
                      relative flex items-center gap-3 md:gap-4 px-3 py-2.5 rounded-sm 
                      transition-all duration-200 group
                      ${
                        isActive
                          ? "bg-primary-600 text-primary-50 font-medium "
                          : "text-content-secondary hover:bg-surface-tertiary hover:text-content-primary"
                      }
                    `}
                  >
                    <item.icon
                      className={`w-5 h-5 shrink-0 ${
                        isCollapsed ? "md:mx-auto" : ""
                      }`}
                      style={{
                        color: "currentColor",
                      }}
                    />

                    {!isCollapsed && (
                      <span className="text-sm tracking-wide">{item.name}</span>
                    )}

                    {/* Mobile: Always show text */}
                    <span className="md:hidden text-sm tracking-wide">
                      {item.name}
                    </span>
                  </NavLink>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer - Optional */}
        <div className="p-4 border-t border-border-default">
          <p className="text-xs text-content-muted text-center">
            © 2024 Admin Console
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
