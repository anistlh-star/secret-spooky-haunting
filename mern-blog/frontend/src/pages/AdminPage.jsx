//workspaces/codespaces-blank/mern-blog/frontend/src/pages/AdminPage.jsx
import { useState, useEffect } from "react";
import API from "../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/AdminPage.css";

const AdminPanel = () => {
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBlog();
    fetchUser();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await API.get("/admin/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("fetching all blogs", res.data);
      setBlogs(res.data.getBlog || []);
    } catch (error) {
      console.error({ message: "error fetching blogs in admin panel", error });
    }
  };

  const fetchUser = async () => {
    try {
      const res = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.getUser || []);
      console.log("fetching all users", res.data.getUser);
      console.log("fetching total User", res.data.totalUsers || 0);

      setTotalUsers(res.data.totalUsers);
    } catch (error) {
      console.log({ message: "error fetching users in admin panel", error });
    }
  };

  const handleApproveBlog = async (blogId) => {
    try {
      const res = await API.put(
        `/admin/blogs/${blogId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Blog Approved ", res.data);
      fetchBlog();
      navigate("/admin");
    } catch (error) {
      console.log({ message: "error approving blogs in admin panel", error });
    }
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      await API.delete(`/admin/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBlog();
    } catch (error) {
      console.log({ message: "error deleting blogs in admin panel", error });
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Panel</h1>

      <div className="admin-sections-grid">
        <div className="blogs-section">
          <h2>Blogs Management</h2>
          <div className="blogs-list">
            {blogs.map((b) => (
              <div key={b._id} className="blog-card">
                <h3 className="blog-title">
                  <Link to={`/blogs/${b._id}`}>{b.title}</Link>
                </h3>
                <div className={`status-badge status-${b.status}`}>
                  {b.status}
                </div>
                <p className="blog-status">Status: {b.status}</p>
                <p className="blog-status">Likes: {b.likes || 0}</p>
                <p className="blog-status">
                  Comments: {b.comments.length || 0}
                </p>
                {b.image && (
                  <img
                    src={
                      b.image.startsWith("https")
                        ? b.image
                        : `https://secret-spooky-haunting-g4vw7pwp7w6w3995j-5000.app.github.dev/uploads/${b.image}`
                    }
                    alt="Blog"
                    className="blog-image"
                  />
                )}
                <p className="blog-author">
                  <Link to={`/user/${b.author._id}`} className="author-link">
                    {b.authorName || "Unknown Author"}
                  </Link>
                </p>
                {b.status !== "approved" && (
                  <div className="blog-actions">
                    <button
                      className="btn-approve"
                      onClick={() => handleApproveBlog(b._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteBlog(b._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="users-section">
          <h2>Users Management</h2>
          <div className="users-stats">
            <h3>Total Users: {totalUsers}</h3>
          </div>
          <div className="users-list">
            {users.map((u) => (
              <div key={u._id} className="user-card">
                <p className="user-name">
                  {" "}
                  <Link to={`/user/${id}`}>Name: {u.name}</Link>{" "}
                </p>
                <p className="user-role">
                  <span
                    className={u.isAdmin ? "admin-label" : "non-admin-label"}
                  >
                    Role: {u.isAdmin ? "Admin" : "User"}
                  </span>
                </p>
                <p className="user-email">Email: {u.email}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
