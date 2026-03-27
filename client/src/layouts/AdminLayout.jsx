import React, { useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = { role: "admin" };
  // Desktop: sidebar width changes based on collapse state
  // Mobile: no margin (sidebar is overlay)
  const mainOffset = isCollapsed ? "md:ml-20" : "md:ml-72";

  return (
    <div className="flex min-h-screen bg-surface-primary antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isSubMenuOpen={isSubMenuOpen}
        setIsSubMenuOpen={setIsSubMenuOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        userRole={user.role}
      />

      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-surface-overlay z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Layout Area */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${mainOffset}`}
      >
        <Header
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
