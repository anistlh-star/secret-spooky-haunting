///workspaces/codespaces-blank/mern-blog/backend/routes/userRoutes.js
import express from "express";

import getUserBlogs from "../controllers/userController.js";
const router = express.Router();

router.get("/:id", getUserBlogs);
export default router;
