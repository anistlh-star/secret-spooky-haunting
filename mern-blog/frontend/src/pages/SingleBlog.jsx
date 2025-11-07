//workspaces/codespaces-blank/mern-blog/frontend/src/pages/SingleBlog.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api.js";
import Likes from "../socials/Likes.jsx";
import Comments from "../socials/Comments.jsx";
import "../styles/SingleBlog.css";

const SingleBlog = () => {
  const [blog, setBlog] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = token ? JSON.parse(atob(token.split(".")[1])) : null;
  useEffect(() => {
    const getSingleBlog = async () => {
      try {
        const res = await API.get(`/blogs/${id}`);
        console.log("api response", res.data);
        setBlog(res.data.singleBlog);
      } catch (error) {
        alert("Can't get the blog!");
      }
    };
    if (id) getSingleBlog();
  }, [id]);

  if (!blog) {
    return <div className="loading">Loading blog...</div>;
  }
  const canEditorDelete = () => {
    if (!currentUser || !blog.author) return false;
return currentUser && (currentUser.id === blog.author._id || currentUser.isAdmin  )};
  return (
    <div className="single-blog-container">
      <h2 className="blog-title">{blog.title}</h2>
      <p className="blog-content">{blog.content}</p>
      <p className="blog-category">Category: {blog.category}</p>
   
        {blog.image && (
              <img
                src={
                  blog.image.startsWith("https")
                    ? blog.image
                    : `https://secret-spooky-haunting-g4vw7pwp7w6w3995j-5000.app.github.dev/uploads/${blog.image}`
                }
                alt="Blog"
                style={{ width: "300px", height: "auto" }}
              />
            )}
               {blog.author && (
        <div className="author-section">
          <p>
            <strong>Author: </strong>
            <Link
              to={`/user/${blog.author._id}`}
              className="author-profile-link"
            >
              {blog.author.name}
            </Link>
          </p>
        </div>
      )}
      {canEditorDelete && token && (
        <div>
          <Link className="edit-link" to={`/edit/${blog._id}`}>
            ✏️ Edit Blog
          </Link>
          <button className="delete-btn"
            onClick={() => {
              API.delete(`blogs/${id}`).then(() => {
                alert("deleted succesfully !");
                navigate("/");
              });
            }}
          >Delete Blog</button>
        </div>
      )}
      <Likes blog={blog} />
      <Comments blog={blog} />
    </div>
  );
};

export default SingleBlog;
