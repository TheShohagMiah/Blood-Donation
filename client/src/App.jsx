import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterForm from "./components/client/Register";
import LoginPage from "./components/client/Login";

// Pages
import Home from "./pages/client/Home";
import BloodRequests from "./pages/client/Request";
import FindDonors from "./pages/client/FindDonors";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DonarDashboard from "./pages/donor/DonarDashboard";
import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard";
import AllUsers from "./pages/admin/AllUsers";
import AllDonationRequests from "./pages/admin/AllDonationRequests";

const App = () => {
  // In a real app, get this from your Auth Context or Redux store
  const user = { role: "admin", isAuthenticated: true };

  return (
    <Routes>
      {/* 1. Public Client Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="requests" element={<BloodRequests />} />
        <Route path="find-donors" element={<FindDonors />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterForm />} />
      </Route>

      {/* 2. Authenticated Dashboard Routes */}
      <Route
        element={<ProtectedRoute isAuthenticated={user.isAuthenticated} />}
      >
        {/* Dynamic Dashboard Redirect based on Role */}
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route
            index
            element={
              user.role === "admin" ? (
                <AdminDashboard />
              ) : user.role === "donor" ? (
                <DonarDashboard />
              ) : (
                <VolunteerDashboard />
              )
            }
          />

          {/* Admin Specific Features */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["admin"]} userRole={user.role} />
            }
          >
            <Route path="users" element={<AllUsers />} />
            <Route path="donation-requests" element={<AllDonationRequests />} />
          </Route>

          {/* Volunteer Specific Features could go here */}
        </Route>
      </Route>

      {/* 404 Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
