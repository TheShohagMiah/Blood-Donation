import Donate from "../models/donate.js";
import Request from "../models/request.js";
import User from "../models/user.js";

export const createDonation = async (req, res, next) => {
  try {
    const requestId = req.body.requestId;
    const donorId = req.user.id;

    // check if blood request exists
    const bloodRequest = await Request.findById(requestId);
    if (!bloodRequest) {
      const error = new Error("This request is no longer available");
      error.statusCode = 404;
      return next(error);
    }

    // check if donor exists
    const donor = await User.findById(donorId);
    if (!donor) {
      const error = new Error("Donor not found. Please login again.");
      error.statusCode = 404;
      return next(error);
    }

    // check blood group is matched
    // if (bloodRequest.bloodGroup !== donor.bloodGroup) {
    //   const error = new Error(
    //     "Your blood group does not match the recipient's requirement.",
    //   );
    //   error.status = 401;
    //   return next(error);
    // }

    if (bloodRequest.requester.toString() === donorId) {
      const error = new Error("You cannot donate to your own request.");
      error.statusCode = 400;
      return next(error);
    }

    // check donor is available or not
    if (donor.lastDonationDate) {
      const lastDate = new Date(donor.lastDonationDate);
      const today = new Date();
      const diffInTime = today.getTime() - lastDate.getTime();
      const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
      if (diffInDays < 90) {
        const error = new Error(
          `You must wait ${90 - diffInDays} more days before donating again.`,
        );
        error.statusCode = 400;
        return next(error);
      }
    }

    //    create a request
    const { message, estimatedArrival } = req.body;
    const donation = await Donate.create({
      requestId: requestId,
      donorId: donorId,
      status: "interested",
      message,
      estimatedArrival,
    });

    bloodRequest.status = "inprogress";
    await bloodRequest.save();

    res.status(201).json({
      success: true,
      message: "Thank you! Your interest to donate has been recorded.",
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDonations = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      bloodGroup,
      status,
      district,
      upazila,
    } = req.query;

    const filter = {};
    if (bloodGroup) filter["bloodGroup"] = bloodGroup;
    if (status) filter["status"] = status;
    if (district) filter["district"] = district;
    if (upazila) filter["upazila"] = upazila;

    const searchTerm = req.query.search;

    if (searchTerm) {
      filter["$or"] = [
        { hospitalName: { $regex: searchTerm, $options: "i" } },
        { "donorId.name": { $regex: searchTerm, $options: "i" } },
        { "requestId.patientName": { $regex: searchTerm, $options: "i" } },
      ];
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const [totalDonations, donations] = await Promise.all([
      Donate.countDocuments(filter),
      Donate.find(filter)
        .populate("donorId", "name bloodGroup contactInfo")
        .populate("requestId", "patientName bloodGroup hospital location")
        .skip(skip)
        .limit(limitNumber)
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

export const getDonationsByUser = async (req, res, next) => {
  try {
    const donorId = req.user.id;
    const donations = await Donate.find({ donorId }).populate("requestId");

    res.status(200).json({
      success: true,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};

export const getDonationsByRequest = async (req, res, next) => {
  try {
    const requestId = req.params.id;
    const donations = await Donate.find({ requestId }).populate(
      "donorId",
      "name bloodGroup contactInfo",
    );

    res.status(200).json({
      success: true,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDonationStatus = async (req, res, next) => {
  try {
    const donationId = req.params.id;
    const { status } = req.body;
    const donation = await Donate.findById(donationId);

    if (!donation) {
      const error = new Error("Donation not found.");
      error.statusCode = 404;
      return next(error);
    }
    donation.status = status;
    await donation.save();
    res.status(200).json({
      success: true,
      message: "Donation status updated successfully.",
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDonation = async (req, res, next) => {
  try {
    const donationId = req.params.id;
    const donation = await Donate.findById(donationId);

    if (!donation) {
      const error = new Error("Donation not found.");
      error.statusCode = 404;
      return next(error);
    }
    await donation.remove();
    res.status(200).json({
      success: true,
      message: "Donation deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
