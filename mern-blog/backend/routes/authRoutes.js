///workspaces/codespaces-blank/mern-blog/backend/routes/authRoutes.js
import express from "express";
// import User from "../models/User.js";
import { register, login } from "../controllers/authController.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;
