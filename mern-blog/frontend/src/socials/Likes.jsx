//workspaces/codespaces-blank/mern-blog/frontend/src/socials/Likes.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api.js";
import "../styles/Likes.css";

const Likes = ({ blog }) => {
  const token = localStorage.getItem("token");
  const [likes, setLikes] = useState(blog?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const Userlikes = async () => {
      try {
        const res = await API.get(`/blogs/${id}`);
        const currentBlog = res.data.singleBlog;

        if (!token) {
          setIsLiked(false);
          setLikes(currentBlog.likes.length || 0);
          return;
        }

        const getTokenId = JSON.parse(atob(token.split(".")[1]));
        const currentuserId = getTokenId.id;
        const userHasliked =
          currentBlog.likedBy?.some((likedUser) => {
            // Handle both object ID string and populated user object
            const likedUserId = likedUser._id
              ? likedUser._id.toString()
              : likedUser.toString();
            return likedUserId === currentuserId;
          }) || false;
        setIsLiked(userHasliked);
        setLikes(currentBlog.likes || 0);
      } catch {
        alert("Error checking like status");
        setIsLiked(false);
      }
    };
    Userlikes();
  }, [id, token]);

  const handleToggleLike = async () => {
    if (!token) {
      alert("Please login to like this post!");
      return;
    }
    try {
      const res = await API.post(`/blogs/${id}/toggle-like`);
      setLikes(res.data.likes);
      setIsLiked(res.data.liked);
      const freshBlogRes = await API.get(`/blogs/${id}`);
      console.log("🔄 Fresh blog data:", freshBlogRes.data.singleBlog.likes);
    } catch (error) {
      console.log("Like error:", error);
      alert("Error liking the post! Please try again.");
    }
  };

  return (
    <div className="likes-container">
      <button className="like-button" onClick={handleToggleLike}>
        {isLiked ? "❤️" : "🤍"}
        <span className="like-count">
          {likes} {likes === 1 ? "Like" : "Likes"}
        </span>
      </button>
      {!token && <p className="login-prompt">🔐 Login to like this blog</p>}
    </div>
  );
};

export default Likes;
