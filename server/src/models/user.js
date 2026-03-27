import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
      trim: true,
    },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png", // Professional placeholder
    },
    bloodGroup: {
      type: String,
      required: [true, "Blood group is required"],
      enum: {
        values: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        message: "{VALUE} is not a supported blood group",
      },
    },
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
    },
    upazila: {
      type: String,
      required: [true, "Upazila is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["donor", "admin", "volunteer"],
      default: "donor",
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
  },
  { timestamps: true },
);

// Middleware to hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method for password comparison
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
