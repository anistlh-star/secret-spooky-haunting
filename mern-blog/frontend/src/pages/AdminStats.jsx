// frontend/src/pages/AdminStats.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext"; // ← ADD THIS
import { useNavigate } from "react-router-dom"; // ← ADD THIS
import API from "../api.js";
import "../styles/AdminStats.css";

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalComments: 0,
    totalLikes: 0,
    recentUsers: [],
    pendingBlogs: 0,
    blogsPerUser: [],
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🎯 ADD AUTH PROTECTION
  const { user: currentUser ,isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 🎯 PROTECT ADMIN ACCESS
    console.log("🧠 Debug isAdmin:", isAdmin);
console.log("👤 Current user:", currentUser);
    if (isAdmin == false) {
      alert("Access denied! Admins only.");
      navigate("/");
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("📊 Fetching admin stats...");

        const token = localStorage.getItem("token");
        const res = await API.get(`/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Fetched adminStats:", res.data);
        setStats({
          totalBlogs: res.data.totalBlogs || 0,
          totalComments: res.data.totalComments || 0,
          totalLikes: res.data.totalLikes || 0,
          recentUsers: res.data.recentUsers || [],
          pendingBlogs: res.data.pendingBlogs || 0,
          blogsPerUser: res.data.blogsPerUser || [],
          totalUsers: res.data.totalUsers || 0,
        });
      } catch (error) {
        console.error("❌ Error fetching admin stats:", error);
        setError("Failed to load statistics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin, navigate]);

  // 🎯 CALCULATE DERIVED STATS
  const averageLikesPerBlog =
    stats.totalBlogs > 0 ? (stats.totalLikes / stats.totalBlogs).toFixed(1) : 0;

  const averageCommentsPerBlog =
    stats.totalBlogs > 0
      ? (stats.totalComments / stats.totalBlogs).toFixed(1)
      : 0;

  // 🎯 SORT BLOGS PER USER BY COUNT (HIGHEST FIRST)
  const sortedBlogsPerUser = [...stats.blogsPerUser].sort(
    (a, b) => b.blogCount - a.blogCount
  );

  if (loading) {
    return (
      <div className="admin-stats-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading admin statistics... 📊</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-stats-container">
        <div className="error-state">
          <div className="error-icon">❌</div>
          <h2>Error Loading Statistics</h2>
          <p>{error}</p>
          <button
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-stats-container">
      <div className="admin-stats-header">
        <h1>📊 Admin Dashboard</h1>
        <p className="last-updated">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">📝</div>
          <h3>Total Blogs</h3>
          <p className="stat-number">{stats.totalBlogs}</p>
          <div className="stat-subtext">
            {stats.pendingBlogs} pending approval
          </div>
        </div>

        <div className="stat-card primary">
          <div className="stat-icon">👥</div>
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
          <div className="stat-subtext">
            {stats.recentUsers.length} recently joined
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">💬</div>
          <h3>Total Comments</h3>
          <p className="stat-number">{stats.totalComments}</p>
          <div className="stat-subtext">{averageCommentsPerBlog} per blog</div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">❤️</div>
          <h3>Total Likes</h3>
          <p className="stat-number">{stats.totalLikes}</p>
          <div className="stat-subtext">{averageLikesPerBlog} per blog</div>
        </div>

        <div className="stat-card danger">
          <div className="stat-icon">⏳</div>
          <h3>Pending Blogs</h3>
          <p className="stat-number">{stats.pendingBlogs}</p>
          <div className="stat-subtext">Need approval</div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">🆕</div>
          <h3>Recent Users</h3>
          <p className="stat-number">{stats.recentUsers.length}</p>
          <div className="stat-subtext">Last 5 registrations</div>
        </div>
      </div>

      {/* Detailed Sections Grid */}
      <div className="sections-grid">
        {/* Recent Users Section */}
        <div className="section-card">
          <div className="section-header">
            <span className="section-icon">👥</span>
            <h2 className="section-title">
              Recent Users ({stats.recentUsers.length})
            </h2>
          </div>

          {stats.recentUsers.length > 0 ? (
            <div className="recent-users-list">
              {stats.recentUsers.map((user, index) => (
                <div key={user._id} className="user-item">
                  <div className="user-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="user-info">
                    <div className="user-name">
                      {user.name || "Unnamed User"}
                    </div>
                    <div className="user-email">{user.email}</div>
                    <div className="user-meta">
                      <span className="user-join-date">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                      <span
                        className={`user-role ${
                          user.isAdmin ? "role-admin" : "role-user"
                        }`}
                      >
                        {user.isAdmin ? "👑 Admin" : "👤 User"}
                      </span>
                    </div>
                  </div>
                  <div className="user-rank">#{index + 1}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <p>No recent users found</p>
            </div>
          )}
        </div>

        {/* Top Bloggers Section */}
        <div className="section-card">
          <div className="section-header">
            <span className="section-icon">🏆</span>
            <h2 className="section-title">Top Bloggers</h2>
          </div>

          {sortedBlogsPerUser.length > 0 ? (
            <div className="blogs-per-user-list">
              {sortedBlogsPerUser.slice(0, 10).map((user, index) => (
                <div key={index} className="user-blog-item">
                  <div className="user-rank">#{index + 1}</div>
                  <div className="user-blog-info">
                    <div className="user-blog-name">
                      {user.name || "Unknown User"}
                    </div>
                    <div className="user-blog-email">{user.email}</div>
                  </div>
                  <div className="blog-count">
                    <span className="blog-count-number">{user.blogCount}</span>
                    <span className="blog-count-label">
                      blog{user.blogCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p>No user blog data available</p>
            </div>
          )}
        </div>
      </div>

      {/* 🎯 NEW: Quick Stats Summary */}
     
    </div>
  );
};

export default AdminStats;
