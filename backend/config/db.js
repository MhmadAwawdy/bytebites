import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("DB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};