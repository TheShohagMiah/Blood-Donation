import { Router } from "express";
import {
  createRequest,
  deleteRequest,
  getOwnRequest,
  getRequests,
  updateRequest,
  updateRequestStatus,
} from "../controllers/requestControllers.js";
import {
  authorizeRoles,
  isAuthenticated,
} from "../middlewares/authMiddlewares.js";

const requestRoutes = Router();

requestRoutes.get("/", getRequests);
requestRoutes.post("/", isAuthenticated, createRequest);
requestRoutes.get("/own", isAuthenticated, getOwnRequest);
requestRoutes.patch(
  "/status/:id",
  isAuthenticated,
  authorizeRoles("admin", "donor"),
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

export default requestRoutes;
