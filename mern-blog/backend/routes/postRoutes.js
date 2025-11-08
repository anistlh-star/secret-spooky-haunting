//mern-blog/backend/routes/postRoutes.js
import express from "express";

import dotenv from "dotenv";
import multer from "multer";
dotenv.config();
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getSingleBlog,
  searchBlog,
  getMyBlog,
} from "../controllers/postController.js";

import {
  getComment,
  addComment,
  updateComment,
  deleteComment,
  replyToComment,
} from "../controllers/commentController.js";

import {
  likeBlog,
  unlikeBlog,
  toggleLikeandUnlike,
} from "../controllers/likeController.js";
import { handleGameBlogs } from "../controllers/rawgBlogController.js";
import { removeBlogImage } from "../controllers/imageController.js";

//Home controller functions

router.get("/", getBlogs);
router.get("/rawg", handleGameBlogs);
router.get("/myblogs", authMiddleware, getMyBlog);

router.get("/search", searchBlog); // Specific route first
router.get("/:id", getSingleBlog); // Catch-all route last
router.post("/", upload.single("image"), authMiddleware, createBlog);
router.put("/:id", upload.single("image"), authMiddleware, updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);

//comment controller functions

router.get("/:id/comments", getComment);
router.post("/:id/comments", authMiddleware, addComment);
router.put("/:id/comments/:commentId", authMiddleware, updateComment);
router.delete("/:id/comments/:commentId", authMiddleware, deleteComment);
router.post("/:id/comments/:commentId/reply", authMiddleware, replyToComment);

//like controller functions

router.post("/:id/like", authMiddleware, likeBlog);
router.post("/:id/unlike", authMiddleware, unlikeBlog);
router.post("/:id/toggle-like", authMiddleware, toggleLikeandUnlike);
//image controller functions
router.patch("/:id/remove-image", authMiddleware, removeBlogImage);

export default router;
