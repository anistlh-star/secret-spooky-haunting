import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✔ MongoDB connected successfully ✔");
    
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};
export default connectDB;
