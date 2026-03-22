const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Mongoose Bad ObjectId (Cast Error)
  if (err.name === "CastError") {
    message = `Resource not found. Invalid: ${err.path}`;
    statusCode = 400;
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    statusCode = 400;
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    statusCode = 400;
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token. Please log in again.";
    statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    message = "Your session has expired. Please log in again.";
    statusCode = 401;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      error: err,
    }),
  });
};

export default errorHandler;
