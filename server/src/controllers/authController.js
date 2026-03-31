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
    data: user,
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

export const getAllUsers = async (req, res, next) => {
  // Use .lean() for faster read-only performance in large datasets
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  if (!users || users.length === 0) {
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

export const getDonors = async (req, res, next) => {
  try {
    const [totalDonors, donors] = await Promise.all([
      User.countDocuments({ role: "donor", status: { $ne: "blocked" } }),
      User.find({ role: "donor", status: { $ne: "blocked" } })
        .select("-password")
        .sort({ createdAt: -1 }),
    ]);

    // Check if donors exist
    if (!donors || donors.length === 0) {
      const error = new Error("No donors found in the records.");
      error.statusCode = 404;
      return next(error);
    }

    // Success response
    res.status(200).json({
      success: true,
      count: totalDonors,
      data: donors,
    });
  } catch (err) {
    // Pass any database or execution errors to the global error handler
    next(err);
  }
};

export const getVolunteers = async (req, res, next) => {
  try {
    const [totalVolunteers, volunteers] = await Promise.all([
      User.countDocuments({ role: "volunteer", status: { $ne: "blocked" } }),
      User.find({ role: "volunteer", status: { $ne: "blocked" } })
        .select("-password")
        .sort({ createdAt: -1 }),
    ]);

    if (!volunteers || volunteers.length === 0) {
      const error = new Error("No volunteers found in this record");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      success: false,
      count: totalVolunteers,
      data: volunteers,
    });
  } catch (error) {
    next(error);
  }
};
export const updateUserRole = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { role } = req.body;

    const allowedRoles = ["admin", "donor", "volunteer"];
    if (!allowedRoles.includes(role)) {
      const error = new Error("Invalid role value.");
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findById(id);
    if (!user) {
      const error = new Error("User no longer exists.");
      error.statusCode = 404;
      return next(error);
    }

    const isAdmin = req.user.role === "admin";
    if (!isAdmin) {
      const error = new Error("Only admin can update users status.");
      error.statusCode = 403;
      return next(error);
    }

    if (user.role === role) {
      const error = new Error(`User already has role: ${role}`);
      error.statusCode = 400;
      return next(error);
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User role has been updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const allowedStatuses = ["active", "blocked"];
    if (!allowedStatuses.includes(status)) {
      const error = new Error("Invalid status value.");
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findById(id);
    if (!user) {
      const error = new Error("User no longer exists.");
      error.statusCode = 404;
      return next(error);
    }

    const isAdmin = req.user.role === "admin";
    if (!isAdmin) {
      const error = new Error("Only admin can update users status.");
      error.statusCode = 403;
      return next(error);
    }

    // Check if status is already set to the requested value
    if (user.status === status) {
      const error = new Error(`User status is already ${status}`);
      error.statusCode = 400;
      return next(error);
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Status has been updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};
