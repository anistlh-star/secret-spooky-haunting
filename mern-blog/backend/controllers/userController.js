///workspaces/codespaces-blank/mern-blog/backend/controllers/userController.js
import Blog from "../models/Blog.js";
import User from "../models/User.js";

const getUserBlogs = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user first to get user details
    const user = await User.findById(id);
    console.log("Users in database:", user);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Find all blogs by this user
    const blogs = await Blog.find({ author: id })
      .populate("author", "name _id")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        joinDate: user.createdAt,
        blogCount: blogs.length,
      },
      blogs: blogs,
    });
  } catch (error) {
    console.error("❌ Error getting user blogs:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

export default getUserBlogs;