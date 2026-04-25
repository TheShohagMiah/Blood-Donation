import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/client/Navbar";
import Footer from "../components/client/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-(--color-surface-main)">
      <Navbar />
      <main className="pt-22 pb-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
