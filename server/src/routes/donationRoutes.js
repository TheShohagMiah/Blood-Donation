import { Router } from "express";
import {
  createDonation,
  getAllDonations,
} from "../controllers/donateControllers.js";
import { isAuthenticated } from "../middlewares/authMiddlewares.js";

const donationRouter = Router();

donationRouter.post("/", isAuthenticated, createDonation);
donationRouter.get("", getAllDonations);
export default donationRouter;
