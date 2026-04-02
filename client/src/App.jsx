import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/client/Home";
import BloodRequests from "./pages/client/Request";
import FindDonors from "./pages/client/FindDonors";
import LoginPage from "./components/client/Login";
import RegisterForm from "./components/client/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DonarDashboard from "./pages/donor/DonarDashboard";
import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard";
import AllUsers from "./pages/admin/AllUsers";
import AllDonationRequests from "./pages/admin/AllDonationRequests";
import Profile from "./pages/shared/Profile";
import Unauthorized from "./pages/shared/Unauthorized";
import { useGetMeQuery } from "./redux/features/isAuth/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "./redux/slices/authSlice";
import Loader from "./ui/Loader";
import PublicRoute from "./components/PublicRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";

const App = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  // 1. Run the query. isFetching is true on every refresh.
  const { data, isLoading, isFetching } = useGetMeQuery();

  useEffect(() => {
    if (data?.user) {
      dispatch(setCredentials(data.user));
    }
  }, [data, dispatch]);

  // until we have an answer from the server.
  if (isLoading || isFetching) {
    return <Loader />;
  }
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          className:
            "border border-[var(--color-border-default)] font-medium uppercase tracking-[0.20em] text-[10px]",
          duration: 4000,
          style: {
            background: "var(--color-surface-card)",
            color: "var(--color-content-primary)",
            backdropFilter: "blur(8px)",
            padding: "12px 24px",
            borderRadius: "12px",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
          success: {
            iconTheme: {
              primary: "var(--color-primary-600)",
              secondary: "white",
            },
            style: { borderLeft: "4px solid var(--color-primary-600)" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "white" },
            style: { borderLeft: "4px solid #ef4444" },
          },
        }}
      />

      <Routes>
        {/* Public Application Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="requests" element={<BloodRequests />} />
          <Route path="find-donors" element={<FindDonors />} />

          <Route
            path="login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="register"
            element={
              <PublicRoute>
                <RegisterForm />
              </PublicRoute>
            }
          />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "donor", "volunteer"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Admin Specific */}
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AllUsers />
              </ProtectedRoute>
            }
          />

          {/* Role Specific Dashboards */}
          <Route
            path="donor"
            element={
              <ProtectedRoute allowedRoles={["donor"]}>
                <DonarDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="volunteer"
            element={
              <ProtectedRoute allowedRoles={["volunteer"]}>
                <VolunteerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Shared Protected Routes */}
          <Route path="donation-requests" element={<AllDonationRequests />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute allowedRoles={["admin", "donor", "volunteer"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
