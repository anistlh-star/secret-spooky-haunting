//workspaces/codespaces-blank/mern-blog/frontend/src/pages/AdminPage.jsx
import { useState, useEffect } from "react";
import API from "../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // ← ADD THIS
import "../styles/AdminPage.css";

const AdminPanel = () => {
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  // 🎯 USE CONTEXT INSTEAD OF localStorage
  const { user: currentUser, isAdmin } = useAuth();
  const token = localStorage.getItem("token");

  useEffect(() => {
    // 🎯 ADD ADMIN CHECK
    console.log("🧠 Debug isAdmin:", isAdmin);
console.log("👤 Current user:", currentUser);
    if (!isAdmin) {
      alert("Access denied! Admins only.");
      navigate("/");
      return;
    }

    fetchBlog();
    fetchUser();
  }, [id, isAdmin, navigate]);

  const fetchBlog = async () => {
    try {
      const res = await API.get("/admin/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("fetching all blogs", res.data);
      setBlogs(res.data.getBlog || []);
    } catch (error) {
      console.error({ message: "error fetching blogs in admin panel", error });
      alert("Error fetching blogs");
    } finally {
      setLoading(false);
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
      alert("Error fetching users");
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
      alert("Blog approved successfully!");
      fetchBlog();
    } catch (error) {
      console.log({ message: "error approving blogs in admin panel", error });
      alert("Error approving blog");
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      await API.delete(`/admin/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Blog deleted successfully!");
      fetchBlog();
    } catch (error) {
      console.log({ message: "error deleting blogs in admin panel", error });
      alert("Error deleting blog");
    }
  };

  const toggleUserAdmin = async (userId, makeAdmin) => {
    if (
      !window.confirm(
        `Are you sure you want to ${
          makeAdmin ? "promote" : "demote"
        } this user?`
      )
    ) {
      return;
    }

    try {
      const res = await API.patch(
        `/admin/users/${userId}/admin`,
        { makeAdmin },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("User admin status updated:", res.data);
      alert(res.data.message);
      fetchUser();
    } catch (error) {
      console.error("Error updating user admin status:", error);
      alert(error.response?.data?.message || "Error updating user");
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete user "${userName}" and all their blogs?`
      )
    ) {
      return;
    }

    // 🎯 PREVENT SELF-DELETION
    if (currentUser && currentUser.id === userId) {
      alert("You cannot delete your own account!");
      return;
    }

    try {
      await API.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("User deleted successfully");
      alert("User deleted successfully");
      fetchUser();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(error.response?.data?.message || "Error deleting user");
    }
  };

  // 🎯 ADD LOADING STATE
  if (loading) {
    return <div className="loading">Loading admin panel...</div>;
  }

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Panel</h1>

      <div className="admin-sections-grid">
        <div className="blogs-section">
          <h2>Blogs Management ({blogs.length})</h2>
          <div className="blogs-list">
            {blogs.length === 0 ? (
              <p className="no-data">No blogs found.</p>
            ) : (
              blogs.map((b) => (
                <div key={b._id} className="blog-card">
                  <h3 className="blog-title">
                    <Link to={`/blogs/${b._id}`}>{b.title}</Link>
                  </h3>
                  <div className={`status-badge status-${b.status}`}>
                    {b.status}
                  </div>
                  <p className="blog-meta">Likes: {b.likes || 0}</p>
                  <p className="blog-meta">
                    Comments: {b.comments?.length || 0}
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
                    <Link to={`/user/${b.author?._id}`} className="author-link">
                      {b.authorName || "Unknown Author"}
                    </Link>
                  </p>
                  <div className="blog-actions">
                    {b.status !== "approved" && (
                      <button
                        className="btn-approve"
                        onClick={() => handleApproveBlog(b._id)}
                      >
                        Approve
                      </button>
                    )}
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteBlog(b._id)}
                    >
                      Delete Blog
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="users-section">
          <h2>Users Management ({users.length})</h2>
          <div className="users-stats">
            <h3>Total Users: {totalUsers}</h3>
          </div>
          <div className="users-list">
            {users.length === 0 ? (
              <p className="no-data">No users found.</p>
            ) : (
              users.map((u) => (
                <div key={u._id} className="user-card">
                  <p className="user-name">
                    <strong>Name:</strong> {u.name}
                  </p>
                  <p className="user-email">
                    <strong>Email:</strong> {u.email}
                  </p>
                  <p className="user-role">
                    <span className={u.isAdmin ? "admin-label" : "user-label"}>
                      <strong>Role:</strong>{" "}
                      {u.isAdmin ? "👑 Admin" : "👤 User"}
                    </span>
                  </p>
                  <div className="user-actions">
                    {/* 🎯 IMPROVED LOGIC: Show actions for non-current user */}
                    {currentUser && currentUser.id !== u._id ? (
                      <>
                        <button
                          className={`btn-${u.isAdmin ? "demote" : "promote"}`}
                          onClick={() => toggleUserAdmin(u._id, !u.isAdmin)}
                        >
                          {u.isAdmin ? "👑 Remove Admin" : "⭐ Make Admin"}
                        </button>
                        <button
                          className="btn-delete-user"
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          disabled={u.isAdmin}
                        >
                          🗑️ Delete User
                        </button>
                      </>
                    ) : (
                      <span className="current-user-note">(Current User)</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
