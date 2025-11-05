//backend/models/Blog.js

import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String },
  author: {
    type: mongoose.Schema.Types.ObjectId, // Store ID, not name
    ref: "User", // Reference User model
    required: true,
  },
  image: { type: String },
  authorName: { type: String },
  likes: { type: Number, default: 0 },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [], // Empty array by default
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      replies: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
          },
          text: { type: String, required: true },
          createdAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: "pending" },
});

const Blog = mongoose.model("Blog", BlogSchema);
export default Blog;
