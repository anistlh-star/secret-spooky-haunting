// frontend/src/components/Comments.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // ← ADD THIS
import API from "../api.js";
import "../styles/Comments.css";

const Comments = () => {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  // 🎯 USE AUTHCONTEXT INSTEAD OF MANUAL TOKEN PARSING
  const { user, isAdmin } = useAuth();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchComments();
  }, [id]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/blogs/${id}/comments`);
      setComments(res.data.comments || []);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await API.post(
        `/blogs/${id}/comments`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      fetchComments();
    } catch {
      alert("Failed to add comment");
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const updateComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      await API.put(
        `/blogs/${id}/comments/${commentId}`,
        { text: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      setEditText("");
      fetchComments();
    } catch {
      alert("Failed to update comment");
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    try {
      await API.delete(`/blogs/${id}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments();
    } catch {
      alert("Failed to delete comment");
    }
  };

  // ✅ ADD REPLY HANDLER
  const addReply = async (commentId) => {
    if (!replyText.trim()) return;
    try {
      await API.post(
        `/blogs/${id}/comments/${commentId}/reply`,
        { text: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyText("");
      setReplyingTo(null);
      fetchComments();
    } catch {
      alert("Failed to post reply");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // 🎯 UPDATED PERMISSION CHECK WITH AUTHCONTEXT
  const canModify = (comment) => {
    if (!user) return false;
    return user.id === comment.user.toString() || isAdmin;
  };

  const getUserInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  if (loading) {
    return (
      <div className="comments-container">
        <div className="loading">Loading comments...</div>
      </div>
    );
  }

  return (
    <div className="comments-container">
      <div className="comments-section">
        <h3 className="comments-header">Comments ({comments.length})</h3>

        {/* EDIT MODE */}
        {editingId && (
          <div className="edit-mode">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="text-area text-area-edit"
              rows="4"
              placeholder="Edit your comment..."
            />
            <div className="comment-actions">
              <button
                onClick={() => updateComment(editingId)}
                className="btn btn-save"
              >
                💾 Save Changes
              </button>
              <button onClick={cancelEdit} className="btn btn-cancel">
                ❌ Cancel
              </button>
            </div>
          </div>
        )}

        {/* COMMENT LIST */}
        <div className="comment-list">
          {comments.length === 0 ? (
            <div className="empty-state">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                <div className="comment-user">
                  <div className="user-avatar">
                    {getUserInitial(comment.user?.name)}
                  </div>
                  <span className="user-name">
                    {comment.user?.name || "User"}
                    {/* 🎯 UPDATED ADMIN BADGE CHECK */}
                    {comment.user?.isAdmin && (
                      <span className="admin-badge">ADMIN</span>
                    )}
                  </span>
                </div>

                <p className="comment-text">{comment.text}</p>
                <div className="comment-date">
                  📅 {new Date(comment.createdAt).toLocaleString()}
                </div>

                {/* REPLY BUTTON */}
                {/* 🎯 UPDATED AUTH CHECK */}
                {user && (
                  <button
                    className="btn btn-reply"
                    onClick={() =>
                      setReplyingTo(
                        replyingTo === comment._id ? null : comment._id
                      )
                    }
                  >
                    💬 Reply
                  </button>
                )}

                {/* EDIT/DELETE BUTTONS */}
                {canModify(comment) && (
                  <div className="comment-actions">
                    <button
                      onClick={() => startEdit(comment)}
                      className="btn btn-edit"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteComment(comment._id)}
                      className="btn btn-delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}

                {/* REPLY FORM */}
                {replyingTo === comment._id && (
                  <div className="reply-box">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      rows="3"
                      className="text-area text-area-reply"
                    />
                    <div className="reply-actions">
                      <button
                        onClick={() => addReply(comment._id)}
                        className="btn btn-save"
                      >
                        💬 Post Reply
                      </button>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="btn btn-cancel"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* RENDER REPLIES */}
                <h4>Replies : </h4>

                {comment.replies?.length > 0 && (
                  <div className="replies-container">
                    {comment.replies.map((reply) => (
                      <div key={reply._id} className="reply-item">
                        <p>
                          <strong>{reply.user?.name || "User"}:</strong>{" "}
                          {reply.text}
                        </p>
                        <span className="reply-date">
                          📅 {new Date(reply.createdAt).toLocaleString()}
                        </span>
                        {/* 🎯 UPDATED PERMISSION CHECK FOR REPLIES */}
                        {canModify(reply) && (
                          <div className="comment-actions">
                            <button
                              onClick={() => startEdit(reply)}
                              className="btn btn-edit"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => deleteComment(reply._id)}
                              className="btn btn-delete"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* ADD COMMENT FORM */}
        {/* 🎯 UPDATED AUTH CHECK */}
        {user && !editingId && (
          <form onSubmit={addComment} className="comment-form">
            <div className="form-group">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="text-area text-area-add"
                rows="4"
              />
            </div>
            <button type="submit" className="btn btn-add">
              💬 Add Comment
            </button>
          </form>
        )}

        {/* 🎯 UPDATED AUTH CHECK */}
        {!user && (
          <div className="login-prompt">Please log in to leave a comment</div>
        )}
      </div>
    </div>
  );
};

export default Comments;