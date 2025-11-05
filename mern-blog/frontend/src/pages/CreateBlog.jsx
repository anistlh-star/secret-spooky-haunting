//mern-blog/frontend/src/pages/CreateBlog.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api.js";
import "../styles/CreateBlog.css";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  const handleAddBlog = async (e) => {
    e.preventDefault();
    if (!title || !content || !category) {
      alert("All fields are required!");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      console.log("saving image ! ");
      if (image) formData.append("image", image);

      const response = await API.post(`/blogs`, formData);
      console.log("blog Created ", response.data);
      alert("Blog created!");
      navigate("/");
    } catch (error) {
      console.error("Error adding post in the frontend!", error.message);
      alert("Oops! Couldn't create the blog.");
    }
  };

  return (
    <div className="create-blog-container">
      <h2 className="create-blog-title">Create Blog</h2>
      <form className="create-blog-form" onSubmit={handleAddBlog}>
        <input
          className="create-blog-input"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="create-blog-input"
          placeholder="Enter category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <textarea
          className="create-blog-textarea"
          placeholder="Enter content ..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <label>📸 Upload Blog Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <small>Find pictures online, copy their address, paste here!</small>

        <button className="create-blog-button" type="submit">
          Add Blog
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
