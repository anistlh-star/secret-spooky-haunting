//workspaces/codespaces-blank/mern-blog/backend/controllers/adminController.js
import Blog from "../models/Blog.js";
import User from "../models/User.js";

export const adminStats = async (req, res) => {
  try {
    // Total blogs
    const totalBlogs = await Blog.countDocuments();
    console.log("received total blogs", totalBlogs);

    // ✅ FIXED: Calculate total comments from blogs
    const BlogwithComments = await Blog.aggregate([
      {
        $project: {
          // 💡 This does NOT permanently create or remove fields in the database.
          // It just shapes what goes through the aggregation pipeline temporarily.
          commentCount: { $size: "$comments" }, // makes a new temporary field commentCount
        },
      },

      {
        $group: {
          _id: null,
          totalComments: { $sum: "$commentCount" }, // ✅ should match the field name in $project
        },
      },
    ]);

    const totalComments = BlogwithComments[0]?.totalComments || 0;
    console.log("received total Comments ", totalComments);
    // Total likes
    const blogsWithLikes = await Blog.aggregate([
      {
        $group: {
          _id: null,
          totalLikes: { $sum: "$likes" },
        },
      },
    ]);
    const totalLikes = blogsWithLikes[0]?.totalLikes || 0;
    console.log("received total likes", totalLikes);

    // Pending blogs
    const pendingBlogs = await Blog.countDocuments({ status: "pending" });
    console.log("received pending blogs count", pendingBlogs);
//total Users 
const totalUsers = await User.countDocuments();
console.log('total users' ,  totalUsers)

    // Recent users
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    console.log("received recent users", recentUsers.length);

    console.log("✅ Admin stats fetched successfully");

    //getting no of blogs per user
    const users = await User.find();
    const blogsPerUser = [];
    for (const user of users) {
      const countUserBlogs = await Blog.countDocuments({ author: user._id });
      blogsPerUser.push({
        name: user.name,
        email: user.email,
        blogCount: countUserBlogs,
      });
    }

    res.json({
      message: "Admin stats retrieved successfully",
      totalBlogs,
      totalComments,
      totalLikes,
      pendingBlogs,
      recentUsers,
      blogsPerUser,
      totalUsers
    });
  } catch (error) {
    console.error("❌ Error getting admin stats:", error);
    res
      .status(500)
      .json({ message: "Error getting stats", error: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const getBlog = await Blog.find();
    res.json({ message: "fetched all blogs ", getBlog });
  } catch (error) {
    res.status(500).json({ message: "Error getting  blogs", error });
  }
};
export const updateBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const { id } = req.params;
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content, category },
      { new: true }
    );
    res.json({ message: "blog Updated ! ", updatedBlog });
  } catch (error) {
    res.status(500).json({ message: "Error updating  blog", error });
  }
};
export const deleteBlog = async (req, res) => {
  try {
    const deleteBlog = await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "blog deleted ! ", deleteBlog });
  } catch (error) {
    res.status(500).json({ message: "Error deleting  blog", error });
  }
};
export const approveBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const approvedBlog = await Blog.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );

    res.json({ message: "blog approved ! ", approvedBlog });
  } catch (error) {
    res.status(500).json({ message: "Error approving  blog", error });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const getUser = await User.find();
    console.log('getUsers : ', getUser )
    console.log('fetching total user length')

    const totalUsers = await User.countDocuments();
console.log('totalUsers : ' ,totalUsers)

    res.json({ message: "fetched Users ", getUser, totalUsers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fethcing   users for admin", error });
  }
};
export const toggleUserAdmin = async (req, res) => {
  try {
    // Debug: Check if req.user exists
    console.log("🔍 toggleUserAdmin - req.user:", req.user ? "Exists" : "UNDEFINED");
    
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required - no user in request" });
    }

    const { userId } = req.params;
    const { makeAdmin } = req.body;

    console.log("🔍 Admin:", req.user._id, "Target user:", userId, "Make admin:", makeAdmin);

    // Prevent admin from removing their own admin status
    if (req.user._id.toString() === userId && makeAdmin === false) {
      return res.status(400).json({ 
        message: "You cannot remove your own admin status" 
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { isAdmin: makeAdmin } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`✅ User ${user.name} admin status updated to: ${user.isAdmin}`);

    res.json({
      message: `User ${makeAdmin ? 'promoted to admin' : 'demoted to regular user'}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error("❌ Error updating user admin status:", error);
    res.status(500).json({ message: "Error updating user admin status", error: error.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    // Debug: Check if req.user exists
    console.log("🔍 deleteUser - req.user:", req.user ? "Exists" : "UNDEFINED");
    
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required - no user in request" });
    }

    const { userId } = req.params;

    console.log("🔍 DELETE USER - Admin:", req.user._id, "Target user:", userId);

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ 
        message: "You cannot delete your own account" 
      });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Also delete user's blogs
    await Blog.deleteMany({ author: userId });

    console.log(`✅ User ${user.name} deleted`);

    res.json({
      message: "User and their blogs deleted successfully",
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};