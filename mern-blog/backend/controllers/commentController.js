//backend/controllers/commentController.js

import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import User from "../models/User.js";
// GET all comments for a blog
export const getComment = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id).populate("comments.user", "name");

    res.json({ comments: blog.comments || [] });
  } catch (error) {
    res.status(500).json({ message: "Error loading comments" });
  }
};

// ADD comment
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.comments.push({
      user: req.user.id,
      text,
      createdAt: new Date(),
    });

    await blog.save();
    res.json({ message: "Comment added!", blog });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment" });
  }
};

// UPDATE comment
// UPDATE comment - FIXED VERSION
export const updateComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { text } = req.body;

    console.log(
      "Update request - Blog:",
      id,
      "Comment:",
      commentId,
      "Text:",
      text
    );

    // Validate input
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text cannot be empty" });
    }

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Find comment using Mongoose's id method (recommended for subdocuments)
    const comment = blog.comments.id(commentId);

    if (!comment) {
      console.log("Comment not found. Available comments:", blog.comments);
      return res.status(404).json({ message: "Comment not found" });
    }

    console.log("Found comment:", comment);

    // Check authorization
    const isOwner = comment.user.toString() === req.user.id;
    const isAdmin = req.user.isAdmin;

    console.log(`Authorization - Owner: ${isOwner}, Admin: ${isAdmin}`);
    console.log(`Comment user: ${comment.user}, Request user: ${req.user.id}`);

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this comment" });
    }

    // Update comment
    comment.text = text;
    await blog.save();

    res.json({
      message: "Comment updated successfully!",
      updatedComment: comment,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({
      message: "Error updating comment",
      error: error.message,
    });
  }
};
// DELETE comment
export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Check if user owns the comment OR is admin
    const isOwner = comment.user.toString() === req.user.id;
    const isAdmin = req.user.isAdmin;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete" });
    }

    blog.comments.pull(commentId);
    await blog.save();
    res.json({ message: "Comment deleted!", blog });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment" });
  }
};
export const replyToComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { text } = req.body;
    const user = req.user.name;

    const blog = await Blog.findById(id);
    if (!blog) return res.send({ message: "blog not found " });

    const comment = blog.comments.id(commentId);
    if (!comment) return res.json({ message: "comment not found ! " });
    const reply = {
      id: new mongoose.Types.ObjectId(),
      user: req.user._id,
      text,
      createdAtcreatedAt: new Date(),
    };
    console.log("id : ", id, "user :", user, "text : ", text);
    comment.replies.push(reply);
    await blog.save();
    res.json({ message: "replied comment ", blog });
  } catch (error) {
    res.status(500).json({ message: "reply  comment Error !" });
  }
};
