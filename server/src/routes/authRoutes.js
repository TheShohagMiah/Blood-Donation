import { Router } from "express";
import {
  changePassword,
  deleteUser,
  getAllUsers,
  getDashboardStats,
  getDonors,
  getMe,
  getVolunteers,
  login,
  logout,
  registration,
  updateProfile,
  updateProfileAvatar,
  updateUserRole,
  updateUserStatus,
} from "../controllers/authController.js";
import {
  authorizeRoles,
  isAuthenticated,
} from "../middlewares/authMiddlewares.js";
import { upload } from "../middlewares/multer.js";

const authRoutes = Router();

authRoutes.post("/register", upload.single("avatar"), registration);
authRoutes.post("/login", login);
authRoutes.get(
  "/stats",
  isAuthenticated,
  authorizeRoles("admin"),
  getDashboardStats,
);
authRoutes.patch("/update-profile", isAuthenticated, updateProfile);
authRoutes.post("/logout", isAuthenticated, logout);
authRoutes.patch("/update-password", isAuthenticated, changePassword);
authRoutes.patch(
  "/update-avatar",
  isAuthenticated,
  upload.single("avatar"),
  updateProfileAvatar,
);

authRoutes.get(
  "/stats",
  isAuthenticated,
  authorizeRoles("admin"),
  getDashboardStats,
);
authRoutes.get("/me", isAuthenticated, getMe);
authRoutes.get("/donors", getDonors);
authRoutes.get("/volunteers", getVolunteers);
authRoutes.get("/users", isAuthenticated, authorizeRoles("admin"), getAllUsers); //completed
authRoutes.patch(
  "/users/status/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateUserStatus,
);
authRoutes.patch(
  "/users/role/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateUserRole,
);
authRoutes.delete(
  "/users/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteUser,
);

export default authRoutes;
