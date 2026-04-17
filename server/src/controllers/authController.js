import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Donate from "../models/donate.js";
import Request from "../models/request.js";

// --- Registration ---
export const registration = async (req, res, next) => {
  const { name, email, password, avatar, district, upazila, role, bloodGroup } =
    req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("User with this email already exists.");
    error.statusCode = 400;
    return next(error);
  }

  if (req?.file) {
    avatar = req.file.path; // Save the file path to the avatar field
  }

  const user = await User.create({
    name,
    email,
    password,
    district,
    upazila,
    bloodGroup,
    role,
    avatar,
  });

  res.status(201).json({
    success: true,
    message: "Account has been created successfully.",
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
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
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
};

// --- Get Current User (Profile) ---
export const getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json({
    success: true,
    user: {
      ...user._doc, // Spread the user document to include all fields except password
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bloodGroup: user.bloodGroup,
      district: user.district,
      upazila: user.upazila,
      status: user.status,
      avatar: user.avatar,
    },
  });
};

// --- Logout ---
export const logout = (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ success: true, message: "Logged out successfully." });
};

export const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(userId).select("+password");
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      return next(error);
    }
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      const error = new Error("Current password is incorrect.");
      error.statusCode = 401;
      return next(error);
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// --- Update Profile ---
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, district, upazila, bloodGroup, avatar } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      return next(error);
    }

    // ✅ Fix 2: use !== undefined so empty strings can clear a field
    const updateData = {
      name: name !== undefined ? name : user.name,
      district: district !== undefined ? district : user.district,
      upazila: upazila !== undefined ? upazila : user.upazila,
      bloodGroup: bloodGroup !== undefined ? bloodGroup : user.bloodGroup,
      avatar: avatar !== undefined ? avatar : user.avatar,
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// --- Get All Users ---
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;
    const [totalUsers, users] = await Promise.all([
      User.countDocuments(),
      User.find({ role: { $ne: "admin" } })
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    // ✅ Fix 3: never throw 404 — return empty array so frontend renders normally
    res.status(200).json({
      success: true,
      count: totalUsers,
      page: Number(page),
      totalPages: Math.ceil(totalUsers / limit),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// --- Get Donors ---
export const getDonors = async (req, res, next) => {
  try {
    const [totalDonors, donors] = await Promise.all([
      User.countDocuments({ role: "donor", status: { $ne: "blocked" } }),
      User.find({ role: "donor", status: { $ne: "blocked" } })
        .select("-password")
        .sort({ createdAt: -1 }),
    ]);

    if (!donors || donors.length === 0) {
      const error = new Error("No donors found in the records.");
      error.statusCode = 404;
      return next(error);
    }

    // const availableDonors = donors.filter((donor) => donor.isAvailable);

    res.status(200).json({ success: true, count: totalDonors, data: donors });
  } catch (err) {
    next(err);
  }
};

// --- Get Volunteers ---
export const getVolunteers = async (req, res, next) => {
  try {
    const [totalVolunteers, volunteers] = await Promise.all([
      User.countDocuments({ role: "volunteer", status: { $ne: "blocked" } }),
      User.find({ role: "volunteer", status: { $ne: "blocked" } })
        .select("-password")
        .sort({ createdAt: -1 }),
    ]);

    if (!volunteers || volunteers.length === 0) {
      const error = new Error("No volunteers found in this record.");
      error.statusCode = 404;
      return next(error);
    }

    // ✅ Fix 4: was success: false
    res
      .status(200)
      .json({ success: true, count: totalVolunteers, data: volunteers });
  } catch (error) {
    next(error);
  }
};

// --- Update User Role ---
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = ["admin", "donor", "volunteer"];
    if (!allowedRoles.includes(role)) {
      const error = new Error("Invalid role value.");
      error.statusCode = 400;
      return next(error);
    }

    if (req.user.role !== "admin") {
      const error = new Error("Only admins can update user roles.");
      error.statusCode = 403;
      return next(error);
    }

    const user = await User.findById(id);
    if (!user) {
      const error = new Error("User no longer exists.");
      error.statusCode = 404;
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
      message: `User role updated to ${role} successfully.`,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// --- Update User Status ---
export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["active", "blocked"];
    if (!allowedStatuses.includes(status)) {
      const error = new Error(
        `Invalid status. Must be one of: ${allowedStatuses.join(", ")}`,
      );
      error.statusCode = 400;
      return next(error);
    }

    if (req.user.role !== "admin") {
      const error = new Error("Only admins can update user status.");
      error.statusCode = 403;
      return next(error);
    }

    const user = await User.findById(id);
    if (!user) {
      const error = new Error("User no longer exists.");
      error.statusCode = 404;
      return next(error);
    }

    if (user.status === status) {
      const error = new Error(`User status is already ${status}.`);
      error.statusCode = 400;
      return next(error);
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User is now ${status}.`,
      user: { _id: user._id, name: user.name, status: user.status },
    });
  } catch (error) {
    next(error);
  }
};

// --- Delete User ---
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin") {
      const error = new Error("Only admins can delete users.");
      error.statusCode = 403;
      return next(error);
    }

    const user = await User.findById(id);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      return next(error);
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User has been deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// --- Dashboard Stats ---
export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalRequests, totalDonations] = await Promise.all([
      User.countDocuments({ status: { $ne: "blocked" } }),
      Request.countDocuments(),
      Donate.countDocuments({ status: "done" }),
    ]);

    res.status(200).json({
      success: true,
      data: { totalUsers, totalRequests, totalDonations },
    });
  } catch (error) {
    next(error);
  }
};
