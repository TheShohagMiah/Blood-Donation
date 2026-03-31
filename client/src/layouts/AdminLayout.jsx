import React, { useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import { Outlet } from "react-router-dom";

const AdminLayout = ({ userRole }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Desktop: sidebar width changes based on collapse state
  // Mobile: no margin (sidebar is overlay)
  const mainOffset = isCollapsed ? "md:ml-20" : "md:ml-72";

  return (
    <div className="flex min-h-screen bg-[var(--color-surface-main)] antialiased transition-colors duration-300">
      {/* 1. Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isSubMenuOpen={isSubMenuOpen}
        setIsSubMenuOpen={setIsSubMenuOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        userRole={userRole || "admin"} // Pass role from props
      />

      {/* 2. Main Layout Area */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${mainOffset}`}
      >
        {/* Sticky Header with Backdrop Blur */}
        <Header
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* 3. Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
          {/* Max-width container for better data scannability */}
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Outlet />
          </div>
        </main>

        {/* 4. Subtle Footer for Admin Console */}
        <footer className="px-10 py-6 border-t border-[var(--color-border-default)]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-content-muted)]">
              &copy; 2026 LifeFlow Terminal &bull; Industrial Healthcare Systems
            </p>
            <div className="flex gap-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary-600)] cursor-pointer hover:underline">
                System Status: Online
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-content-muted)]">
                v1.2.4-stable
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
