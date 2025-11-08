//workspaces/codespaces-blank/mern-blog/frontend/src/pages/UserProfile.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api.js";
import "../styles/UserProfile.css";
import { useAuth } from "../contexts/AuthContext.jsx";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAdmin } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        console.log("🔄 Fetching profile for user ID:", id);
        const res = await API.get(`/user/${id}`);
        console.log("📦 API response:", res.data);

        if (res.data.success) {
          setUser(res.data.user);
          setBlogs(res.data.blogs || []);
        } else {
          alert(res.data.message || "User not found!");
          navigate("/");
        }
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        alert("User not found!");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (id && id !== "undefined") {
      fetchUserProfile();
    } else {
      alert("Invalid user profile link!");
      navigate("/");
    }
  }, [id, navigate]);

  // 🎯 NEW: Function to handle admin actions
  const handleToggleAdmin = async () => {
    if (
      !window.confirm(
        `Are you sure you want to ${
          user.isAdmin ? "remove admin rights from" : "make"
        } ${user.name}?`
      )
    ) {
      return;
    }

    try {
      const res = await API.patch(
        `/admin/users/${user._id}/admin`,
        { makeAdmin: !user.isAdmin },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert(res.data.message);
      // Refresh the user data
      setUser({ ...user, isAdmin: !user.isAdmin });
    } catch (error) {
      console.error("❌ Error updating admin status:", error);
      alert(error.response?.data?.message || "Error updating admin status");
    }
  };

  if (loading) return <div className="loading">Loading user profile...</div>;
  if (!user) return <div className="error">User not found!</div>;

  return (
    <div className="user-profile-container">
      <div className="user-header">
        <h1 className="user-title">{user.name}'s Profile</h1>
        <p className="user-email">📧 {user.email}</p>

        {/* 🎯 NEW: Show if this is YOUR profile */}
        {currentUser && currentUser.id === user._id && (
          <div className="current-user-badge">👋 This is your profile!</div>
        )}

        {/* 🎯 NEW: Show admin badge */}
        {user.isAdmin && <div className="admin-badge">👑 Admin User</div>}

        <p className="user-join-date">
          🗓️ Joined:{" "}
          {new Date(user.createdAt || user.joinDate).toLocaleDateString()}
        </p>
        <p className="user-blog-count">📝 {blogs.length} Blogs Written</p>

        {/* 🎯 NEW: Admin actions */}
        {isAdmin && currentUser && currentUser.id !== user._id && (
          <div className="admin-actions">
            <h3>Admin Actions:</h3>
            <button
              className={`btn-admin-toggle ${
                user.isAdmin ? "remove-admin" : "make-admin"
              }`}
              onClick={handleToggleAdmin}
            >
              {user.isAdmin ? "👑 Remove Admin Rights" : "⭐ Make Admin"}
            </button>
          </div>
        )}
      </div>

      <div className="user-blogs">
        <h2 className="blogs-title">{user.name}'s Blogs</h2>
        {blogs.length === 0 ? (
          <p className="no-blogs">No blogs written yet.</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="blog-card">
              <Link to={`/blogs/${blog._id}`} className="blog-title">
                <h3>{blog.title}</h3>
              </Link>
              {blog.image && (
                <img
                  src={
                    blog.image.startsWith("https")
                      ? blog.image
                      : `https://secret-spooky-haunting-g4vw7pwp7w6w3995j-5000.app.github.dev/uploads/${blog.image}`
                  }
                  alt="Blog"
                  className="blog-image"
                />
              )}
              <p className="blog-content">
                {blog.content.substring(0, 100)}...
              </p>
              <div className="blog-info">
                <span className="blog-category">
                  🏷️ {blog.category || "Uncategorized"}
                </span>
                <span className="blog-likes">❤️ {blog.likes || 0} likes</span>
                <span className="blog-comments">
                  💬 {blog.comments?.length || 0} comments
                </span>
                <span className="blog-date">
                  📅 {new Date(blog.createdAt).toLocaleDateString()}
                </span>

                {/* 🎯 NEW: Show edit button if it's your blog */}
                {currentUser && currentUser.id === user._id && (
                  <Link to={`/edit-blog/${blog._id}`} className="edit-blog-btn">
                    ✏️ Edit
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserProfile;
