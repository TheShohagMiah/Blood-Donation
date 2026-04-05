import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getDonors,
  getMe,
  getVolunteers,
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

authRoutes.post("/register", registration); //completed
authRoutes.post("/login", login); //completed
authRoutes.post("/logout", isAuthenticated, logout);
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
