import mongoose from "mongoose";
import dotenv from "dotenv";

// Ensure variables are loaded before anything else
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`Node Environment: ${process.env.NODE_ENV}`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
