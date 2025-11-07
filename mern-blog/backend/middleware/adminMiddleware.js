///workspaces/codespaces-blank/mern-blog/backend/middleware/adminMiddleware.js
import jwt from "jsonwebtoken";


const adminMiddleware = async (req, res, next) => {
  try {
    console.log("👑 ADMIN MIDDLEWARE - Checking admin status...");
    
    if (!req.user) {
      console.log("❌ No user object found");
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    console.log("👑 Checking user:", req.user.name, "isAdmin:", req.user.isAdmin);

    if (!req.user.isAdmin) {
      console.log("❌ Access denied - User is not admin");
      return res.status(403).json({ message: 'Only admin can access this route' });
    }

    console.log("✅ Admin access granted");
    next();
  } catch (error) {
    console.error("❌ Admin middleware error:", error);
    return res.status(403).json({ message: "Access denied: Admin only 🚫" });
  }
}

export default adminMiddleware;