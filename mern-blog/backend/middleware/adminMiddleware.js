///workspaces/codespaces-blank/mern-blog/backend/middleware/adminMiddleware.js
import jwt from "jsonwebtoken";


const adminMiddleware = async (req, res, next) => {

    try {
        if (!req.user || !req.user.isAdmin)
            return res.status(403).json({ message: 'Only admin can access this route' });
        next()
    }
    catch (error) {
        return res.status(403).json({ message: "Access denied: Admin only 🚫" });
    }
}
export default adminMiddleware;