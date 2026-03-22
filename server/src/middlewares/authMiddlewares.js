import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const isAuthenticated = async (req, res, next) => {
  let token;
  token = req.cookies.access_token || req.cookies.token;

  if (!token && req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    const error = new Error("Login first to access this resource.");
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      const error = new Error(
        "User associated with this token no longer exists.",
      );
      error.statusCode = 404;
      return next(error);
    }
    next();
  } catch (error) {
    err.statusCode = 401;
    next(err);
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new Error(
        `Role ${req.user.role} is not allowed to access this resource.`,
      );
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};
