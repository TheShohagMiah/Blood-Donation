import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    recipientName: {
      type: String,
      required: [true, "Recipient name is required"],
      trim: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bloodGroup: {
      type: String,
      required: [true, "Blood group is required"],
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    hospitalName: {
      type: String,
      required: [true, "Hospital name is required"],
      trim: true,
    },
    fullAddress: {
      type: String,
      required: [true, "Full address is required"],
    },
    district: {
      type: String,
      required: true,
    },
    upazila: {
      type: String,
      required: true,
    },
    donationDate: {
      type: Date,
      required: [true, "Donation date is required"],
    },
    donationTime: {
      type: String,
      required: [true, "Donation time is required"],
    },
    message: {
      type: String,
      required: [true, "Please explain why the blood is needed"],
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    urgency: {
      type: String,
      required: true,
      enum: ["normal", "urgent", "emergency"],
    },
    contactNumber: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "done", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Indexing for faster searches by location and blood group
requestSchema.index({ bloodGroup: 1, district: 1, status: 1 });

const Request = mongoose.model("Request", requestSchema);

export default Request;
