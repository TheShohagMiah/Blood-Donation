import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * A professional-grade ProtectedRoute component.
 * @param {React.ReactNode} children - The component to render if authorized.
 * @param {Array<string>} allowedRoles - Array of roles permitted to access the route.
 */
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  // Handle loading state to prevent flickering or premature redirects
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
