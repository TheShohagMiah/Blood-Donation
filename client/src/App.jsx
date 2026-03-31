import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery } from "./redux/features/isAuth/authApi";
import { setCredentials } from "./redux/slices/authSlice";
import { Toaster } from "react-hot-toast";
// Layouts & Guards
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/client/Home";
import BloodRequests from "./pages/client/Request";
import FindDonors from "./pages/client/FindDonors";

// Dashboard Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import DonarDashboard from "./pages/donor/DonarDashboard";
import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard";
import AllUsers from "./pages/admin/AllUsers";
import AllDonationRequests from "./pages/admin/AllDonationRequests";
import Profile from "./pages/shared/Profile";
import LoginPage from "./components/client/Login";
import RegisterForm from "./components/client/Register";
import Unauthorized from "./pages/shared/Unauthorized";
import Loader from "./ui/Loader";

const App = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { data, isLoading, isFetching } = useGetMeQuery();

  useEffect(() => {
    if (data?.user) {
      dispatch(setCredentials(data?.user));
    }
  }, [data, dispatch]);

  if (isLoading || isFetching) {
    return <Loader />;
  }

  return (
    <>
      {/* ✅ 1. Toaster lives OUTSIDE of Routes */}
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

      {/* ✅ 2. Routes only contain Route components */}
      <Routes>
        {/* PUBLIC ZONE */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="requests" element={<BloodRequests />} />
          <Route path="find-donors" element={<FindDonors />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterForm />} />
        </Route>

        {/* PROTECTED ZONE */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "donor", "volunteer"]} />
          }
        >
          <Route element={<AdminLayout userRole={user?.role} />}>
            <Route
              index
              element={
                user?.role === "admin" ? (
                  <AdminDashboard />
                ) : user?.role === "donor" ? (
                  <DonarDashboard />
                ) : (
                  <VolunteerDashboard />
                )
              }
            />
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="users" element={<AllUsers />} />
              <Route
                path="donation-requests"
                element={<AllDonationRequests />}
              />
            </Route>
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
