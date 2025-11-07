// backend/config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log("=== DB CONFIG DEBUG ===");
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
console.log("All env vars:", Object.keys(process.env));
console.log("=======================");

const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGODB_URI;
    
    // If still undefined, use direct connection for now
    if (!mongoURI) {
      console.log("⚠️ Using fallback MongoDB URI");
      mongoURI = "mongodb+srv://talhaimrancce_db_user:kQ4RIuAd2Udb9dIj@cluster0.ydphvsh.mongodb.net/BlogApp?retryWrites=true&w=majority&appName=Cluster0";
    }

    console.log("Connecting to MongoDB with URI:", mongoURI.substring(0, 50) + "...");
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;