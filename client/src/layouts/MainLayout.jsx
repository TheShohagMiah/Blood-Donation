import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/client/Navbar";
import Footer from "../components/client/Footer";

const MainLayout = () => {
  return (
    /* flex-col ensures children stack vertically, min-h-screen spans full viewport */
    <div className="flex flex-col min-h-screen bg-[var(--color-surface-main)]">
      {/* Header stays at the top */}
      <header>
        <Navbar />
      </header>

      {/* flex-grow pushes the footer down if the content is short.
          pt-20 or pt-24 accounts for your 'fixed' Navbar height.
      */}
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Outlet />
        </div>
      </main>

      {/* Footer naturally sits at the bottom */}
      <Footer />
    </div>
  );
};

export default MainLayout;
