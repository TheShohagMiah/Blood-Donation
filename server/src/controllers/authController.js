import jwt from "jsonwebtoken";
import User from "../models/user.js";

// --- Registration ---
export const registration = async (req, res, next) => {
  const { name, email, password, district, upazila, bloodGroup } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("User with this email already exists.");
    error.statusCode = 400;
    return next(error);
  }

  // Note: user.save() is called internally by User.create()
  const user = await User.create({
    name,
    email,
    password,
    district,
    upazila,
    bloodGroup,
  });

  res.status(201).json({
    success: true,
    message: "Account has been created successfully.",
    user: { id: user._id, name: user.name, email: user.email },
  });
};

// --- Login ---
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    return next(error);
  }

  // Generate Token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Logged in successfully.",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
};

// --- Get Current User (Profile) ---
export const getMe = async (req, res, next) => {
  // req.user is already populated by your 'protect' middleware
  const user = await User.findById(req.user.id);

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json({
    success: true,
    user,
  });
};

export const logout = (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

/**
 * @desc    Get all users (Admin Only)
 * @route   GET /api/v1/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res, next) => {
  // Use .lean() for faster read-only performance in large datasets
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  if (!users) {
    const error = new Error("No users found.");
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
};
