import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Donate from "../models/donate.js";
import Request from "../models/request.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../config/cloudinary.js";
import fs from "fs";

const safeUnlink = (filePath) => {
  try {
    fs.unlinkSync(filePath);
  } catch (e) {
    console.warn("Could not delete temp file:", e.message);
  }
};

// --- Registration ---
export const registration = async (req, res, next) => {
  try {
    const { name, email, password, district, upazila, role, bloodGroup } =
      req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User with this email already exists.");
      error.statusCode = 400;
      return next(error);
    }

    const avatarFile = req.file ?? req.files?.[0];
    if (!avatarFile?.path) {
      const error = new Error("Avatar image is required.");
      error.statusCode = 400;
      return next(error);
    }

    const uploadResult = await uploadToCloudinary(avatarFile.path);
    safeUnlink(avatarFile.path);

    if (uploadResult.error) {
      const error = new Error(`Failed to upload avatar: ${uploadResult.error}`);
      error.statusCode = 500;
      return next(error);
    }

    const user = await User.create({
      name,
      email,
      password,
      district,
      upazila,
      bloodGroup,
      role,
      avatar: uploadResult.url,
    });

    res.status(201).json({
      success: true,
      message: "Account has been created successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// --- Login ---
export const login = async (req, res, next) => {
  try {
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

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

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
  } catch (err) {
    next(err);
  }
};

// --- Get Current User (Profile) ---
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// --- Logout ---
export const logout = (req, res) => {
  res.cookie("token", null, {
    expires: new Date(0),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ success: true, message: "Logged out successfully." });
};

// --- Change Password ---
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      return next(error);
    }

    if (!(await user.comparePassword(currentPassword))) {
      const error = new Error("Current password is incorrect.");
      error.statusCode = 401;
      return next(error);
    }

    user.password = newPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    next(error);
  }
};

// --- Update Profile (no avatar — use updateProfileAvatar for that) ---
export const updateProfile = async (req, res, next) => {
  try {
    const { name, district, upazila, bloodGroup } = req.body; // avatar intentionally excluded

    const user = await User.findById(req.user.id);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      return next(error);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          name: name !== undefined ? name : user.name,
          district: district !== undefined ? district : user.district,
          upazila: upazila !== undefined ? upazila : user.upazila,
          bloodGroup: bloodGroup !== undefined ? bloodGroup : user.bloodGroup,
        },
      },
      { new: true, runValidators: true },
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// --- Update Avatar ---
export const updateProfileAvatar = async (req, res, next) => {
  try {
    const avatarFile = req.file ?? req.files?.[0];
    if (!avatarFile?.path) {
      const error = new Error("Avatar image is required.");
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      return next(error);
    }

    if (user.avatar) {
      const deleted = await deleteFromCloudinary(user.avatar);
      if (deleted.error)
        console.warn("Could not delete old avatar:", deleted.error);
    }

    const uploadResult = await uploadToCloudinary(avatarFile.path);
    safeUnlink(avatarFile.path);

    if (uploadResult.error) {
      const error = new Error(`Failed to upload avatar: ${uploadResult.error}`);
      error.statusCode = 500;
      return next(error);
    }

    user.avatar = uploadResult.url;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Avatar updated successfully.",
      data: user,
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
      User.countDocuments({ role: { $ne: "admin" } }), // count should match the query filter
      User.find({ role: { $ne: "admin" } })
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
    ]);

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
    const filter = { role: "donor", status: { $ne: "blocked" } };
    const [totalDonors, donors] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter).select("-password").sort({ createdAt: -1 }),
    ]);

    res.status(200).json({ success: true, count: totalDonors, data: donors });
  } catch (err) {
    next(err);
  }
};

// --- Get Volunteers ---
export const getVolunteers = async (req, res, next) => {
  try {
    const filter = { role: "volunteer", status: { $ne: "blocked" } };
    const [totalVolunteers, volunteers] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter).select("-password").sort({ createdAt: -1 }),
    ]);

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

    const user = await User.findById(id);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      return next(error);
    }

    if (user.avatar) {
      const deleted = await deleteFromCloudinary(user.avatar);
      if (deleted.error)
        console.warn("Could not delete avatar:", deleted.error);
    }

    await user.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "User has been deleted successfully." });
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
