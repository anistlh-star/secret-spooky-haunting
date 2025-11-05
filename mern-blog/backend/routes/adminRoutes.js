//workspaces/codespaces-blank/mern-blog/backend/routes/adminRoutes.js
import express from 'express'
import { getAllBlogs, updateBlog, deleteBlog, approveBlog, getAllUsers,adminStats } from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js'; 
import adminMiddleware from '../middleware/adminMiddleware.js'; 
const router = express.Router();

router.get('/stats' , adminStats)
router.get('/blogs', authMiddleware, adminMiddleware, getAllBlogs);
router.put('/blogs/:id', authMiddleware, adminMiddleware, updateBlog);
router.put('/blogs/:id/approve', authMiddleware, adminMiddleware, approveBlog)
router.delete('/blogs/:id', authMiddleware, adminMiddleware, deleteBlog);
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);

export default router;