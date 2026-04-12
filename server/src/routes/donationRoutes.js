import { Router } from "express";
import {
  createDonation,
  getDonationsByUser,
  updateDonationStatus,
  deleteDonation,
} from "../controllers/donateControllers.js";
import { isAuthenticated } from "../middlewares/authMiddlewares.js";

const donationRouter = Router();

donationRouter.post("/", isAuthenticated, createDonation);
donationRouter.get("/my-donations", isAuthenticated, getDonationsByUser);
donationRouter.patch("/status/:id", isAuthenticated, updateDonationStatus);
donationRouter.delete("/:id", isAuthenticated, deleteDonation);
export default donationRouter;
