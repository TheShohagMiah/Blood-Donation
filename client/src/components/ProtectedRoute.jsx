import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasAccess =
    allowedRoles.length === 0 || allowedRoles.includes(user?.role);

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
