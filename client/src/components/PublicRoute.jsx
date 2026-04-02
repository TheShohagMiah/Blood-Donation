import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * PublicRoute prevents authenticated users from accessing restricted
 * guest pages like Login or Register.
 */
const PublicRoute = ({ children }) => {
  const { user, isLoading } = useSelector((state) => state.auth);

  // Prevent redirecting while we are still checking if the user is logged in
  if (isLoading) {
    return null;
  }

  if (user) {
    // If user is logged in, redirect them based on their role
    // or to a default dashboard
    const redirectPath =
      user.role === "admin" ? "/dashboard" : "/dashboard/profile";

    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PublicRoute;
