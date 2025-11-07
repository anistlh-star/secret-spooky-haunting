import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api.js";
import "../styles/EditBlog.css";

const EditBlog = () => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    image: null,
  });
  const [blog, setBlog] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = token ? JSON.parse(atob(token.split(".")[1])) : null;

  const getImageUrl = (image) => {
    if (!image) return null;
    return image.startsWith("https")
      ? image
      : `https://secret-spooky-haunting-g4vw7pwp7w6w3995j-5000.app.github.dev/uploads/${image}`;
  };

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/blogs/${id}`);
        const blogData = res.data.singleBlog; // Fixed: Correct path
        setBlog(blogData);
        setForm({
          title: blogData.title || "",
          content: blogData.content || "",
          category: blogData.category || "",
          image: null,
        });
        setCurrentImage(blogData.image || null);
      } catch (error) {
        console.error("Error fetching blog:", error);
        alert("Oops! Couldn't get the blog.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] }); // Fixed: Updates form.image
  };

  const handleEditBlog = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert("Title and content are required!");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("category", form.category);
      if (form.image) formData.append("image", form.image);

      await API.put(`/blogs/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("✅ Blog updated successfully!");
      navigate(`/blogs/${id}`);
    } catch (error) {
      console.error("Update error:", error);
      alert(
        `❌ Failed to update blog: ${
          error.response?.data?.message || "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async () => {
    if (window.confirm("Are you sure? This cannot be undone.")) {
      try {
        await API.delete(`/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Blog deleted!");
        navigate("/");
      } catch (error) {
        alert("❌ Failed to delete blog!");
      }
    }
  };

  const handleDeleteImage = async () => {
    if (window.confirm("Remove the current image?")) {
      try {
        const response = await API.patch(
          `/blogs/${id}/remove-image`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCurrentImage(null);
        setBlog(response.data.blog);
        alert("✅ Image removed successfully!");
      } catch (error) {
        console.error("Remove image error:", error);
        alert("❌ Failed to remove image!");
      }
    }
  };

  const canEditBlog = () => {
    if (!currentUser || !blog) return false;
    return currentUser.id === blog.author?._id || currentUser.isAdmin; // Fixed: Safe navigation, no alert
  };

  if (loading || !blog) return <div className="loading">Loading...</div>;
  if (!canEditBlog()) {
    return (
      <div className="error-container">
        <h2>🚫 Access Denied</h2>
        <p>You don't have permission to edit this blog.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="edit-blog-container">
      <div className="edit-blog-card">
        <h2 className="edit-blog-title">✏️ Edit Blog</h2>
        <form className="edit-blog-form" onSubmit={handleEditBlog}>
          {/* Form fields unchanged for brevity */}
          <div className="form-group">
            <label className="form-label">Blog Title</label>
            <input
              className="form-input"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              className="form-input"
              name="category"
              value={form.category}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Blog Content</label>
            <textarea
              className="form-textarea"
              name="content"
              value={form.content}
              onChange={handleChange}
              rows="12"
              required
            />
          </div>

          {currentImage && (
            <div className="current-image-section">
              <label className="form-label">Current Image</label>
              <div className="image-preview">
                <img
                  src={getImageUrl(currentImage)}
                  alt={blog.title}
                  className="current-image"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={handleDeleteImage}
                >
                  🗑️ Remove Image
                </button>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              {currentImage ? "Replace Image" : "Upload Blog Image"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>

          <div className="action-buttons">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "🔄 Saving..." : "💾 Save Changes"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              ↩️ Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDeleteBlog}
            >
              🗑️ Delete Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
