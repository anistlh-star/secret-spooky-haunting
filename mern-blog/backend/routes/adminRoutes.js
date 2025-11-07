//workspaces/codespaces-blank/mern-blog/backend/routes/adminRoutes.js
import express from "express";
import {
  getAllBlogs,
  updateBlog,
  deleteBlog,
  approveBlog,
  getAllUsers,
  adminStats,
  toggleUserAdmin,
  deleteUser,
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
const router = express.Router();

router.get('/stats', authMiddleware, adminMiddleware, adminStats);
router.get('/blogs', authMiddleware, adminMiddleware, getAllBlogs);
router.put('/blogs/:id', authMiddleware, adminMiddleware, updateBlog);
router.put('/blogs/:id/approve', authMiddleware, adminMiddleware, approveBlog);
router.delete('/blogs/:id', authMiddleware, adminMiddleware, deleteBlog);
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.patch("/users/:userId/admin", authMiddleware, adminMiddleware, toggleUserAdmin);  
router.delete("/users/:userId", authMiddleware, adminMiddleware, deleteUser);         

router.patch(
  "/users/:userId/admin",
  authMiddleware,
  adminMiddleware,
  toggleUserAdmin
);
router.delete("/users/:userId", authMiddleware, adminMiddleware, deleteUser);

export default router;
