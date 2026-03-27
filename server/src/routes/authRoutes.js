import { Router } from "express";
import {
  getAllUsers,
  getMe,
  login,
  logout,
  registration,
  updateUserRole,
  updateUserStatus,
} from "../controllers/authController.js";
import {
  authorizeRoles,
  isAuthenticated,
} from "../middlewares/authMiddlewares.js";

const authRoutes = Router();

authRoutes.post("/register", registration);
authRoutes.post("/login", login);
authRoutes.post("/logout", isAuthenticated, logout);
authRoutes.get("/me", isAuthenticated, getMe);
authRoutes.get("/users", isAuthenticated, authorizeRoles("admin"), getAllUsers);
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
export default authRoutes;
