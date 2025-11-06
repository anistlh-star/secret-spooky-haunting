///workspaces/codespaces-blank/mern-blog/frontend/src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api.js";
import SearchBlog from "./SearchBlog.jsx";
import "../styles/Home.css";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const token = localStorage.getItem("token");
  const currentUser = token ? JSON.parse(atob(token.split(".")[1])) : null;

  const fetchBlogs = async (pageNumber) => {
    setLoading(true);
    try {
      console.log(`🔄 Fetching page ${pageNumber}...`);

      const res = await API.get(`/blogs?page=${pageNumber}&limit=10`);
      console.log("📦 Backend response:", res.data); // ← See the actual response

      setBlogs(res.data.blogs);
      setCurrentPage(res.data.pagination.currentPage);
      setTotalBlogs(res.data.pagination.totalBlogs);
      setTotalPages(res.data.pagination.totalPages);
      console.log("📊 Pagination Data:", res.data.pagination); // For debugging
    } catch (error) {
      console.error("❌ Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBlogs(1);
  }, []);
  const gotoPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchBlogs(newPage);
    }
  };
  const handleDeleteBlog = async (blogId) => {
    try {
      await API.delete(`/blogs/${blogId}`);
      // Refresh the list
      fetchBlogs(currentPage);
      alert("Blog deleted successfully!");
    } catch (error) {
      alert("Error deleting blog!");
    }
  };
  const canEditBlog = (blog) => {
    if (!currentUser || !blog.author) return false;

    return currentUser.id === blog.author._id || currentUser.isAdmin === true;
  };
  return (
    <div className="home-container">
      <SearchBlog />
      <h2 className="blogs-title">All Blogs</h2>
      {loading && <div className="loading">⏳ Loading blogs...</div>}
      <ul className="blog-list">
        {blogs.map((blog) => (
          <li key={blog._id || blog.id} className="blog-card">
            <h3 className="blog-title">
              <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
            </h3>

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

            <p className="blog-content">{blog.content}</p>

            {blog.author && blog.author._id && blog.author.name ? (
              <p className="author-info">
                <span className="author-label">👤 Author: </span>
                <Link to={`/user/${blog.author._id}`} className="author-link">
                  {blog.author.name}
                </Link>
              </p>
            ) : (
              <p className="author-info">
                <span className="author-label">👤 Author: </span>
                <span className="unknown-author">Unknown</span>
              </p>
            )}

            <p className="blog-category">
              Category: {blog.category || "Uncategorized"}
            </p>
            <p className="blog-likes">👍 {blog.likes}</p>
            <p className="blog-comments">
             💬 {blog.comments?.length || 0}
            </p>

            {/* Show actions only if user can edit this blog */}
            {canEditBlog(blog) && (
              <div className="blog-actions">
                <Link className="edit-link" to={`/edit/${blog._id}`}>
                  ✏️ Edit Blog
                </Link>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteBlog(blog._id)} // ← Pass the blog ID
                >
                  🗑️ Delete Blog
                </button>
                <Link className="read-more-link" to={`/blogs/${blog._id}`}>
                  📖 Read More
                </Link>
              </div>
            )}

            {/* Show only Read More for other users */}
            {!canEditBlog(blog) && (
              <div className="blog-actions">
                <Link className="read-more-link" to={`/blogs/${blog._id}`}>
                  📖 Read More
                </Link>
              </div>
            )}
            <small>
              source : {""}
              {blog.source === "RAWG" ? "🎮 RAWG" : "📝 Local"}
            </small>
          </li>
        ))}
      </ul>
      {/* pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => gotoPage(currentPage - 1)}
          >
            ⬅️ Previous
          </button>

          <span className="page-info">
            Page {currentPage} of {totalPages}
            {totalBlogs > 0 && ` (${totalBlogs} total blogs)`}
          </span>

          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => gotoPage(currentPage + 1)}
          >
            Next ➡️
          </button>
        </div>
      )}
      
    </div>
  );
};

export default Home;
