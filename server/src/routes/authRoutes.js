import { Router } from "express";
import {
  getAllUsers,
  getMe,
  login,
  logout,
  registration,
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
export default authRoutes;
