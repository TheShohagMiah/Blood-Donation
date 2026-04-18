import Request from "../models/request.js";

/**
 * @desc    Create a new donation entry
 * @access  Private
 */
export const createRequest = async (req, res, next) => {
  try {
    const request = await Request.create({
      ...req.body,
      requester: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "SYSTEM_ENTRY_POSTED: Logged successfully.",
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Fetch and filter pending entries (Public Registry)
 * @access  Public
 */
export const getRequests = async (req, res, next) => {
  try {
    const {
      bloodGroup,
      district,
      upazila,
      page = 1,
      limit = 10,
      search,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (district) query.district = district;
    if (upazila) query.upazila = upazila;

    if (search) {
      query.$or = [
        { recipientName: { $regex: search, $options: "i" } },
        { hospitalName: { $regex: search, $options: "i" } },
      ];
    }

    const [totalRequests, requests] = await Promise.all([
      Request.countDocuments(query),
      Request.find(query)
        .populate("requester", "name email contactNumber")
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      pagination: {
        totalRequests,
        totalPages: Math.ceil(totalRequests / limitNum),
        currentPage: pageNum,
        pageSize: requests.length,
      },
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingRequests = async (req, res, next) => {
  try {
    const pendingRequests = await Request.find({ status: "pending" })
      .populate("requester", "name email contactNumber")
      .sort({ createdAt: -1 })
      .lean();

    if (!pendingRequests.length) {
      const error = new Error("DATA_NOT_FOUND: No pending requests.");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      success: true,
      message: "PENDING_REQUESTS_RETRIEVED: Sync complete.",
      data: pendingRequests,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Modify entry status (Owner/Admin/Volunteer)
 * @access  Private
 */
export const updateRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const VALID_STATUSES = ["pending", "inprogress", "done", "cancelled"];
    if (!VALID_STATUSES.includes(status)) {
      const error = new Error("PROTOCOL_ERROR: Invalid status code.");
      error.statusCode = 400;
      return next(error);
    }

    const request = await Request.findById(id);
    if (!request) {
      const error = new Error("DATA_NOT_FOUND: Registry record missing.");
      error.statusCode = 404;
      return next(error);
    }

    const isAuthorized =
      request.requester.toString() === req.user.id.toString() ||
      ["admin", "volunteer"].includes(req.user.role);

    if (!isAuthorized) {
      const error = new Error("ACCESS_DENIED: Unauthorized modification.");
      error.statusCode = 403;
      return next(error);
    }

    request.status = status;
    const updatedRequest = await request.save();

    res.status(200).json({
      success: true,
      message: `STATUS_MODIFIED: Set to ${status}.`,
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update registry record (Owner/Admin)
 * @access  Private
 */
export const updateRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id);

    if (!request) {
      const error = new Error("DATA_NOT_FOUND: Record missing.");
      error.statusCode = 404;
      return next(error);
    }

    if (
      request.requester.toString() !== req.user.id.toString() &&
      req.user.role !== "admin"
    ) {
      const error = new Error("ACCESS_DENIED: Insufficient permissions.");
      error.statusCode = 403;
      return next(error);
    }

    const updatedData = await Request.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true, context: "query" },
    ).lean();

    res.status(200).json({
      success: true,
      message: "Request updated successfully.",
      data: updatedData,
    });
  } catch (error) {
    if (error.name === "CastError") {
      error.message = "PROTOCOL_ERROR: Invalid record ID.";
      error.statusCode = 400;
    }
    next(error);
  }
};

/**
 * @desc    Hard delete record (Owner/Admin)
 * @access  Private
 */
export const deleteRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id);

    if (!request) {
      const error = new Error("DATA_NOT_FOUND: Record missing.");
      error.statusCode = 404;
      return next(error);
    }

    if (
      request.requester.toString() !== req.user.id.toString() &&
      req.user.role !== "admin"
    ) {
      const error = new Error("ACCESS_DENIED: Insufficient permissions.");
      error.statusCode = 403;
      return next(error);
    }

    await Request.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "DATA_PURGED: Record removed.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Full telemetry for single record
 * @access  Public
 */
export const getRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id)
      .populate("requester", "name email contactNumber")
      .lean();

    if (!request) {
      const error = new Error("DATA_NOT_FOUND: Record missing.");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "RECORD_ACCESS_GRANTED: Data retrieved.",
      data: request,
    });
  } catch (error) {
    if (error.name === "CastError") {
      error.message = "PROTOCOL_ERROR: Invalid ID format.";
      error.statusCode = 400;
    }
    next(error);
  }
};

/**
 * @desc    Fetch current user records
 * @access  Private
 */
export const getOwnRequests = async (req, res, next) => {
  try {
    const [total, requests] = await Promise.all([
      Request.countDocuments({ requester: req.user.id }),
      Request.find({ requester: req.user.id }).sort({ createdAt: -1 }).lean(),
    ]);

    res.status(200).json({
      success: true,
      message: "SYSTEM_RECORDS_RETRIEVED: Sync complete.",
      count: total,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};
