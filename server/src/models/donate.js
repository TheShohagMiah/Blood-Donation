import mongoose from "mongoose";

const donateSchema = new mongoose(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },

    donarId: {
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

donateSchema.index({ requesterId: 1, donorId: 1 }, { unique: true });

const Donate = mongoose.model("Donate", donateSchema);
export default Donate;
