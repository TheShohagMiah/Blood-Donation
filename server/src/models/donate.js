import mongoose from "mongoose";

const donateSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },

    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    donorStatus: {
      type: String,
      enum: ["interested", "on-the-way", "arrived", "donated", "canceled"],
      default: "interested",
    },

    message: {
      type: String,
      maxlength: 200,
      trim: true,
    },
    estimatedArrival: {
      type: String,
    },
  },
  { timestamps: true },
);

donateSchema.index({ requestId: 1, donorId: 1 }, { unique: true });

const Donate = mongoose.model("Donate", donateSchema);
export default Donate;
