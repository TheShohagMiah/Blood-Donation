import { Router } from "express";
import {
  createRequest,
  deleteRequest,
  getOwnRequests,
  getPendingRequests,
  getRequestAnalytics,
  getRequestById,
  getRequests,
  updateRequest,
  updateRequestStatus,
} from "../controllers/requestControllers.js";
import {
  authorizeRoles,
  isAuthenticated,
} from "../middlewares/authMiddlewares.js";

const requestRoutes = Router();

// 1. SPECIFIC/STATIC ROUTES FIRST
requestRoutes.get("/my-requests", isAuthenticated, getOwnRequests);
requestRoutes.get("/pending", getPendingRequests);
// 2. GENERAL REGISTRY
requestRoutes.get("/", getRequests);

// 3. DYNAMIC PARAMETERS LAST
requestRoutes.get("/:id", getRequestById);

// --- RECORD MODIFICATION ---
requestRoutes.post("/", isAuthenticated, createRequest);

requestRoutes.patch(
  "/status/:id",
  isAuthenticated,
  authorizeRoles("admin", "donor", "volunteer"),
  updateRequestStatus,
);

requestRoutes.put(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin", "volunteer", "donor"),
  updateRequest,
);

requestRoutes.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin", "donor"),
  deleteRequest,
);

requestRoutes.get("/analytics/requests", getRequestAnalytics);
export default requestRoutes;
