import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async(req, res, next) => {
  try {
    console.log("🛡️ AUTH MIDDLEWARE - Checking authorization...");
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No Bearer token found");
      return res.status(401).json({ message: "You need to login first!" });
    }

    const token = authHeader.split(" ")[1];
    console.log("🛡️ Token found, verifying...");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🛡️ Token decoded for user ID:", decoded.id);

    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.log("❌ User not found in database");
      return res.status(404).json({ message: 'User not found!' });
    }

    console.log("✅ Auth successful - User:", user.name, "Admin:", user.isAdmin);
    
    req.user = user;
    next();
    
  } catch (error) {
    console.error("❌ Auth middleware error:", error.message);
    return res.status(401).json({ message: "Bad token. Please log in again." });
  }
};

export default authMiddleware;