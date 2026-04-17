import Donate from "../models/donate.js";
import Request from "../models/request.js";
import User from "../models/user.js";

export const createDonation = async (req, res, next) => {
  try {
    const { status, message, estimatedArrival, requestId } = req.body;
    const donorId = req.user.id;
    // 1. Validate Request
    const bloodRequest = await Request.findById(requestId);
    if (!bloodRequest) {
      const error = new Error("This request is no longer available");
      error.statusCode = 404;
      return next(error);
    }

    // 2. Prevent self-donation
    if (bloodRequest.requester.toString() === donorId) {
      const error = new Error(
        "Operational Error: You cannot donate to your own request.",
      );
      error.statusCode = 400;
      return next(error);
    }

    // 3. Validate Donor & Eligibility
    const donor = await User.findById(donorId);
    if (!donor) {
      const error = new Error("User record not identified.");
      error.statusCode = 404;
      return next(error);
    }

    // check blood group compatibility
    if (donor.bloodGroup !== bloodRequest.bloodGroup) {
      const error = new Error("Your blood group does not match the request.");
      error.statusCode = 400;
      return next(error);
    }

    // 90-day cooldown protocol
    if (donor.lastDonationDate) {
      const diffInDays = Math.floor(
        (new Date() - new Date(donor.lastDonationDate)) / (1000 * 3600 * 24),
      );
      if (diffInDays < 90) {
        const error = new Error(
          `Eligibility Block: Wait ${90 - diffInDays} more days.`,
        );
        error.statusCode = 400;
        return next(error);
      }
    }

    // 5. Update Blood Request Status
    bloodRequest.status = "in-progress";
    await bloodRequest.save();

    // Keep the counter in sync with the actual collection via $inc
    await User.findByIdAndUpdate(
      donorId,
      {
        $inc: { totalDonations: 1 },
        lastDonationDate: new Date(),
        isAvailable: false,
      },
      { new: true },
    );

    // 4. Create Donation Record
    const donation = await Donate.create({
      requestId,
      donorId,
      status: "Pending",
      message,
      estimatedArrival,
    });
    res.status(201).json({
      success: true,
      message: "Your intent to donate has been recorded.",
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

export const getDonationsByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // We use totalCount for the dashboard metrics
    const [totalDonations, donations] = await Promise.all([
      Donate.countDocuments({ donorId: userId }),
      Donate.find({ donorId: userId })
        .populate({
          path: "requestId",
          select:
            "recipientName bloodGroup hospitalName donationDate donationTime requester contactNumber upazila district status fullAddress",
          populate: { path: "requester", select: "name" }, // Populate the person who asked
        })
        .sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      success: true,
      data: donations,
      total: totalDonations,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDonationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g., 'Completed', 'In Progress'

    const donation = await Donate.findById(id);
    if (!donation) {
      const error = new Error("Record not found.");
      error.statusCode = 404;
      return next(error);
    }

    donation.status = status;
    await donation.save();

    // If donation is marked 'Completed', update the donor's last donation date
    if (status === "Completed") {
      await User.findByIdAndUpdate(donation.donorId, {
        lastDonationDate: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      message: "Protocol Updated: Status synchronized.",
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDonation = async (req, res, next) => {
  try {
    const donation = await Donate.findByIdAndDelete(req.params.id);

    if (!donation) {
      const error = new Error("Record not found.");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Record purged from registry.",
    });
  } catch (error) {
    next(error);
  }
};
