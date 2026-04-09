import Request from "../models/request.js";
export const createRequest = async (req, res, next) => {
  try {
    const request = await Request.create({
      ...req.body,
      requester: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Donation request posted successfully.",
      request,
    });
  } catch (error) {
    next(error);
  }
};

export const getRequests = async (req, res, next) => {
  try {
    const {
      bloodGroup,
      district,
      upazila,
      status,
      page = 1,
      limit = 5,
      search,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (district) query.district = district;
    if (upazila) query.upazila = upazila;
    if (status) query.status = status;

    if (search) {
      query.$or = [
        { recipientName: { $regex: search, $options: "i" } },
        { hospitalName: { $regex: search, $options: "i" } },
        { bloodGroup: { $regex: search, $options: "i" } },
      ];
    }

    const [totalRequests, requests] = await Promise.all([
      Request.countDocuments(query),
      Request.find({ ...query, status: "pending" })
        .populate("requester", "name email contactNumber")
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      success: true,
      pagination: {
        totalRequests,
        totalPages: Math.ceil(totalRequests / limitNum),
        currentPage: pageNum,
      },
      requests,
    });
  } catch (error) {
    next(error);
  }
};

export const getOwnRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [total, requests] = await Promise.all([
      Request.countDocuments({ requester: userId }),
      Request.find({ requester: userId }).sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      success: true,
      count: total,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRequest = async (req, res, next) => {
  try {
    const id = req.params.id;
    const request = await Request.findById(id);

    if (!request) {
      const error = new Error("Donation request not found.");
      error.statusCode = 404;
      return next(error);
    }

    const isOwner = request.requester.toString() === req.user.id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      const error = new Error("Not authorized to update this request.");
      error.statusCode = 403;
      return next(error);
    }

    const updatedData = await Request.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Request updated successfully.",
      updatedData,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRequest = async (req, res, next) => {
  try {
    const id = req.params.id;
    const request = await Request.findById(id);

    if (!request) {
      const error = new Error("Request not found.");
      error.statusCode = 404;
      return next(error);
    }

    const isOwner = request.requester.toString() === req.user.id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      const error = new Error("Not authorized to delete this request.");
      error.statusCode = 403;
      return next(error);
    }

    await Request.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Donation request deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const updateRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "inprogress", "done", "canceled"];
    if (!allowedStatuses.includes(status)) {
      const error = new Error("Invalid status value.");
      error.statusCode = 400;
      return next(error);
    }

    const request = await Request.findById(id);
    if (!request) {
      const error = new Error("Request not found.");
      error.statusCode = 404;
      return next(error);
    }

    // 2. Authorization Check
    const isOwner = request.requester.toString() === req.user.id.toString();
    const isAdmin = req.user.role === "admin";
    const isVolunteer = req.user.role === "volunteer";

    if (!isOwner && !isAdmin && !isVolunteer) {
      const error = new Error("Not authorized to change this status.");
      error.statusCode = 403;
      return next(error);
    }

    // 3. Update only the status field
    request.status = status;
    await request.save();

    res.status(200).json({
      success: true,
      message: `Status updated to ${status} successfully.`,
      request,
    });
  } catch (error) {
    next(error);
  }
};
