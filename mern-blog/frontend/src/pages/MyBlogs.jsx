// frontend/src/pages/MyBlogs.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import API from "../api.js";
import "../styles/MyBlogs.css";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { user } = useAuth(); // Removed isAdmin (not needed)

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchMyBlogs();
  }, [user, navigate]);

  const fetchMyBlogs = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/blogs/myblogs");
      console.log("My blogs response:", res.data);
      const validBlogs = (res.data.blogs || []).filter(blog => blog._id && /^[0-9a-fA-F]{24}$/.test(blog._id));
      setBlogs(validBlogs);
    } catch (err) {
      console.error("Error fetching my blogs:", err);
      const msg = err.response?.data?.message || err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId, blogTitle) => {
    if (!blogId || !/^[0-9a-fA-F]{24}$/.test(blogId)) {
      alert("Invalid blog ID");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete "${blogTitle}"?`)) {
      return;
    }

    try {
      await API.delete(`/blogs/${blogId}`); // No manual headers
      alert("Blog deleted successfully!");
      fetchMyBlogs();
    } catch (error) {
      console.error("❌ Error deleting blog:", error);
      alert(error.response?.data?.message || "Failed to delete blog");
    }
  };

  // Removed getStatusBadge (assuming no status field)

  if (loading) {
    return (
      <div className="my-blogs-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your blogs... 📝</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="my-blogs-container">
        <div className="not-logged-in">
          <h2>Please Log In</h2>
          <p>You need to be logged in to view your blogs.</p>
          <Link to="/login" className="login-btn">
            Login
          </Link>
        </div>
      </div>
    );
  }

  const backendBase = import.meta.env.VITE_BACKEND_BASE || "https://secret-spooky-haunting-g4vw7pwp7w6w3995j-5000.app.github.dev";

  return (
    <div className="my-blogs-container">
      <div className="my-blogs-header">
        <h1>My Blogs 📝</h1>
        <p className="subtitle">Manage your published articles</p>
        <div className="header-actions">
          <span className="blog-count">
            {blogs.length} blog{blogs.length !== 1 ? "s" : ""}
          </span>
          <Link to="/create" className="create-new-btn">
            ✨ Create New Blog
          </Link>
        </div>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}

      {blogs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No Blogs Yet</h3>
          <p>
            You haven't written any blogs yet. Start sharing your thoughts with
            the world!
          </p>
          <Link to="/create" className="create-first-btn">
            Write Your First Blog
          </Link>
        </div>
      ) : (
        <div className="blogs-grid">
          {blogs.map((blog) => (
            <div key={blog._id} className="blog-card">
              <div className="blog-header">
                <h3 className="blog-title">
                  <Link to={blog._id ? `/blogs/${blog._id}` : "#"}>{blog.title}</Link>
                </h3>
                {/* Removed status badge */}
              </div>

              {blog.image && (
                <div className="blog-image-container">
                  <img
                    src={
                      blog.image.startsWith("https")
                        ? blog.image
                        : `${backendBase}/uploads/${blog.image}`
                    }
                    alt={blog.title}
                    className="blog-image"
                  />
                </div>
              )}

              <p className="blog-content-preview">
                {blog.content.substring(0, 150)}...
              </p>

              <div className="blog-meta">
                <span className="blog-category">
                  🏷️ {blog.category || "Uncategorized"}
                </span>
                <span className="blog-date">
                  📅 {new Date(blog.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="blog-stats">
                <span className="stat">❤️ {blog.likes || 0} likes</span>
                <span className="stat">
                  💬 {blog.comments?.length || 0} comments
                </span>
                <span className="stat">👁️ {blog.views || 0} views</span>
              </div>

              <div className="blog-actions">
                <Link to={blog._id ? `/edit/${blog._id}` : "#"} className="btn btn-edit">
                  ✏️ Edit
                </Link>
                <Link to={blog._id ? `/blogs/${blog._id}` : "#"} className="btn btn-view">
                  👀 View
                </Link>
                <button
                  onClick={() => handleDeleteBlog(blog._id, blog.title)}
                  className="btn btn-delete"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;