import React, { useEffect, useMemo } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

// Layouts & UI
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import Loader from "./ui/Loader";

// Public Pages
import Home from "./pages/client/Home";
import BloodRequests from "./pages/client/Request";
import FindDonors from "./pages/client/FindDonors"; // This is your Search Page
import LoginPage from "./components/client/Login";
import RegisterForm from "./components/client/Register";

// Dashboard Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import DonarDashboard from "./pages/donor/DonarDashboard";
import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard";
import AllUsers from "./pages/admin/AllUsers";
import AllDonationRequests from "./pages/admin/AllDonationRequests";
import AddUser from "./pages/admin/AddUser";

// Shared Pages
import Profile from "./pages/shared/Profile";
import Unauthorized from "./pages/shared/Unauthorized";

// Logic & State
import { useGetMeQuery } from "./redux/features/isAuth/authApi";
import { setCredentials } from "./redux/slices/authSlice";
import PublicRoute from "./components/PublicRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";
import DonorSearchPage from "./pages/client/Search";
import CreateBloodRequestFromDashboard from "./pages/admin/CreateRequest";
import EditRequest from "./pages/admin/EditRequest";
import RequestDetails from "./pages/shared/RequestDetails";

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { data, isLoading, isFetching } = useGetMeQuery();
  useEffect(() => {
    if (data?.user) {
      dispatch(setCredentials(data.user));
    }
  }, [data, dispatch]);

  const DynamicDashboard = useMemo(() => {
    if (!user) return null;
    switch (user.role) {
      case "admin":
        return <AdminDashboard />;
      case "donor":
        return <DonarDashboard />;
      case "volunteer":
        return <VolunteerDashboard />;
      default:
        return <Navigate to="/unauthorized" replace />;
    }
  }, [user?.role]);

  if (isLoading || isFetching) return <Loader />;

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          className:
            "border border-[var(--color-border-default)] font-medium uppercase tracking-[0.25em] text-[10px]",

          duration: 4000,

          style: {
            background: "var(--color-surface-card)",
            color: "var(--color-content-primary)",
            backdropFilter: "blur(8px)",
            padding: "12px 24px",
            borderRadius: "6px",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },

          success: {
            iconTheme: {
              primary: "#2DCF73",
              secondary: "white",
            },
            style: { borderLeft: "4px solid #2DCF73" },
          },

          error: {
            iconTheme: { primary: "#ef4444", secondary: "white" },
            style: { borderLeft: "4px solid #ef4444" },
          },
        }}
      />

      <Routes>
        {/* --- PUBLIC SECTION --- */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="requests" element={<BloodRequests />} />

          {/* SEARCH PAGE ROUTE */}
          <Route path="search" element={<DonorSearchPage />} />

          <Route path="find-donors" element={<FindDonors />} />
          <Route
            path="requests/:id"
            element={
              <ProtectedRoute>
                <RequestDetails />
              </ProtectedRoute>
            }
          />
          {/* Auth Routes */}
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

        {/* --- DASHBOARD SECTION --- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "donor", "volunteer"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={DynamicDashboard} />

          {/* Admin Routes */}
          <Route path="users" element={<AllUsers />} />
          <Route path="users/add" element={<AddUser />} />

          <Route path="all-requests" element={<AllDonationRequests />} />
          <Route
            path="blood-requests/create"
            element={<CreateBloodRequestFromDashboard />}
          />
          <Route path="donation-requests/edit/:id" element={<EditRequest />} />
          <Route path="donation-requests" element={<div>All Donations</div>} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
