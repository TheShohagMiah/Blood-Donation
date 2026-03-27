import React, { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const auth = {
    isAuthenticated: true,
    role: "admin",
  };
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(auth.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
