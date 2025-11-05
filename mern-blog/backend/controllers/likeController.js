//mern-blog/backend/controllers/likeController.js
import Blog from "../models/Blog.js";

export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.json({ message: "blog not found !" });

    blog.likes += 1;
    await blog.save();
    res.json({ message: "blog Liked ! " });
  } catch (error) {
    console.error("Error loggin in !", error);
    res.status(500).json({ message: "login Error" });
  }
};
export const unlikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found!" });

    if (blog.likes > 0) {
      blog.likes -= 1;
    }

    await blog.save();
    res.json({ message: "Blog unliked!", likes: blog.likes });
  } catch (error) {
    console.error("Error unliking blog:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const toggleLikeandUnlike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found!" });

    // ✅ Now blog.likedBy will always be an array (from model default)
    const hasUserLiked = blog.likedBy.some(
      (likedUserId) => likedUserId.toString() === userId
    );

    if (hasUserLiked) {
      // Unlike - remove user
      blog.likedBy = blog.likedBy.filter(
        likedUser => likedUser.toString() !== userId
      );
      blog.likes = blog.likedBy.length;
      
      await blog.save();
      res.json({
        success: true,
        message: "Post unliked!",
        likes: blog.likes,
        liked: false
      });
    } else {
      // Like - add user
      blog.likedBy.push(userId);
      blog.likes = blog.likedBy.length;
      
      await blog.save();
      res.json({
        success: true,
        message: "Post liked!",
        likes: blog.likes,
        liked: true
      });
    }
  } catch (error) {
    console.error("Like toggle error:", error);
    res.status(500).json({ 
      success: false,
      message: "Like action failed!" 
    });
  }
};