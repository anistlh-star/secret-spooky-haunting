///workspaces/codespaces-blank/mern-blog/backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const authMiddleware = async(req, res, next) => {
  try {
    const authHeader = req.headers.authorization;// what its doing is getting the authorization header from the incoming request 

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.send({ message: "you need to login first !  " });
    }

    const token = authHeader.split(" ")[1]; // it will divide the authHeader which is Bearer abc123xyz in to["Bearer", "abc123xyz"] and it will give the  [1] index element which is the actual token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password')
if(!user) return res.json({message : 'user not found ! '})
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Bad token. Please log in again." });
  }
};
export default authMiddleware;
