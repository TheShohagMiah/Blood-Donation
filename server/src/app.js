import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "./config/corsOptions.js";
import errorHandler from "./utilis/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";

const app = express();

// --- Standard Middleware ---
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Base Route ---
app.get("/", (req, res) => {
  res.status(200).json({ message: "Blood Donation API is working perfectly." });
});

app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
// --- 404 Handler ---
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// --- Global Error Handler ---
app.use(errorHandler);

export default app;
