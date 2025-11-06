//workspaces/codespaces-blank/mern-blog/frontend/src/pages/UserProfile.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api.js";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

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

  if (loading) return <div className="loading">Loading user profile...</div>;
  if (!user) return <div className="error">User not found!</div>;

  return (
    <div className="user-profile-container">
      <div className="user-header">
        <h1 className="user-title">{user.name}'s Profile</h1>
        <p className="user-email">📧 {user.email}</p>
        <p className="user-join-date">
          🗓️ Joined: {new Date(user.joinDate).toLocaleDateString()}
        </p>
        <p className="user-blog-count">📝 {user.blogCount} Blogs Written</p>
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
                    : `https://secret-spooky-haunting-2.onrender.com/uploads/${blog.image}`
                }
                alt="Blog"
                style={{ width: "300px", height: "auto" }}
              />
            )}
              <p className="blog-content">
                {blog.content.substring(0, 100)}...
              </p>
              <div className="blog-info">
                <span className="blog-category">
                  🏷️ {blog.category || "Uncategorized"}
                </span>
                <span className="blog-likes">❤️ {blog.likes} likes</span>
                <span className="blog-likes">
                 💬 {blog.comments.length}
                </span>

                <span className="blog-date">
                  📅 {new Date(blog.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserProfile;
