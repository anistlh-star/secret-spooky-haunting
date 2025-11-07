// frontend/src/pages/AdminStats.jsx
import { useState, useEffect } from "react";
import API from "../api.js";
import '../styles/AdminStats.css'

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalComments: 0,
    totalLikes: 0,
    recentUsers: [],
    pendingBlogs: 0,
    blogsPerUser: [],
    totalUsers : 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("fetching admin stats...");
        const res = await API.get(`/admin/stats`);
        console.log("fetched adminStats ", res.data);
        setStats({
          totalBlogs: res.data.totalBlogs || 0,
          totalComments: res.data.totalComments || 0,
          totalLikes: res.data.totalLikes || 0,
          recentUsers: res.data.recentUsers || [],
          pendingBlogs: res.data.pendingBlogs || 0,
          blogsPerUser: res.data.blogsPerUser || [],
          totalUsers : res.data.totalUsers || 0,
        });
      } catch (error) {
        console.log({ message: "fetching admin stats error !" }, error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-stats-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading admin statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-stats-container">
      <h1>📊 Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Blogs</h3>
          <p className="stat-number">{stats.totalBlogs}</p>
        </div>
          <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Comments</h3>
          <p className="stat-number">{stats.totalComments}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Likes</h3>
          <p className="stat-number">{stats.totalLikes}</p>
        </div>
        
        <div className="stat-card">
          <h3>Pending Blogs</h3>
          <p className="stat-number">{stats.pendingBlogs}</p>
        </div>
        
        <div className="stat-card">
          <h3>Recent Users</h3>
          <p className="stat-number">{stats.recentUsers.length}</p>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="sections-grid">
        {/* Recent Users Section */}
        <div className="section-card">
          <div className="section-header">
            <span className="section-icon">👥</span>
            <h2 className="section-title">Recent Users</h2>
          </div>
          
          {stats.recentUsers.length > 0 ? (
            <div className="recent-users-list">
              {stats.recentUsers.map((user) => (
                <div key={user._id} className="user-item">
                  <div className="user-info">
                    <div className="user-name">{user.name || "Unnamed User"}</div>
                    <div className="user-email">{user.email}</div>
                    <div className="user-meta">
                      <span className="user-join-date">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                      <span className={`user-role ${user.isAdmin ? 'role-admin' : 'role-user'}`}>
                        {user.isAdmin ? "Admin" : "User"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No recent users found</div>
          )}
        </div>

        {/* Blogs Per User Section */}
        <div className="section-card">
          <div className="section-header">
            <span className="section-icon">📝</span>
            <h2 className="section-title">Blogs Per User</h2>
          </div>
          
          {stats.blogsPerUser.length > 0 ? (
            <div className="blogs-per-user-list">
              {stats.blogsPerUser.map((user, index) => (
                <div key={index} className="user-blog-item">
                  <div className="user-blog-info">
                    <div className="user-blog-name">{user.name}</div>
                  </div>
                  <div className="blog-count">
                    <span className="blog-count-number">{user.blogCount}</span>
                    <span className="blog-count-label">blogs</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No user blog data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStats;