///workspaces/codespaces-blank/mern-blog/backend/controllers/postController.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Blog from "../models/Blog.js";
import User from "../models/User.js"; // Add this import

dotenv.config();

export const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // number of page to access or start from page no 1
    const limit = parseInt(req.query.limit) || 10; // how much content to display per page

    const skip = (page - 1) * limit;

    console.log("getting blogs");
    const getBlog = await Blog.find()
      .populate({
        path: "author",
        select: "name _id",
        model: "User", // Explicitly specify the model
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalBlogs = await Blog.countDocuments();
    console.log("total blogs :", totalBlogs);
    const totalPages = Math.ceil(totalBlogs / limit);
    console.log("total pages :", totalPages);

    // console.log("Populated blogs:", getBlog); // Check console
    res.status(200).json({
      blogs: getBlog,

      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalBlogs: totalBlogs,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
export const getSingleBlog = async (req, res) => {
  try {
    console.log("Requested blog ID:", req.params.id);
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }
    // Populate author field to get user name and id
    const singleBlog = await Blog.findById(req.params.id)
      .populate("author", "name email _id")
      .populate("likedBy", "name _id"); // Populate author here too

    if (!singleBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json({ message: "single BLOG", singleBlog });
  } catch (error) {
    console.error("Error fetching single blog:", error);
    res
      .status(500)
      .json({ message: "fetch single blog error", error: error.message });
  }
};
export const createBlog = async (req, res) => {
  try {
    // require authentication middleware to set req.user
    const authorId = req.user?.id;
    if (!authorId) return res.status(401).json({ message: "Unauthorized" });

    const { title, content, category } = req.body;
    const image = req.file ? req.file.filename : undefined;
    const user = await User.findById(authorId);
    const blog = new Blog({
      title,
      content,
      category,
      author: authorId,
      authorName: user?.name || "Unauthorized",
      image,
    });
    const savedBlog = await blog.save();
    res.json({ message: "Blog created!", blog: savedBlog });
  } catch (error) {
    console.error("Error creating blog !! ", error);
    res.status(500).json({ message: "creating blog Error" });
  }
};
// In postController.js - FIX THE IMAGE REMOVAL
export const updateBlog = async (req, res) => {
  try {
    console.log("📝 Update request received:", {
      body: req.body,
      file: req.file,
      params: req.params,
    });

    const { title, content, category, image } = req.body;
    const newImage = req.file ? req.file.filename : undefined;

    console.log("parsed data : ", {
      title,
      content,
      category,
      image,
      newImage,
    });

    const existingBlog = await Blog.findById(req.params.id);
    if (!existingBlog) {
      return res.status(404).json({ message: "No blog found!" });
    }

    // Authorization check
    if (existingBlog.author.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized!" });
    }
    const updatedData = { title, content, category };

    // ✅ SIMPLER: Set image to null instead of undefined
    if (image === null || image === "null") {
      console.log("🗑️ Setting image to null");
      updatedData.image = null;
    } else if (newImage) {
      updatedData.image = newImage;
    }

    console.log("💾 Final update data:", updatedData);

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    ).populate("author", "name _id");

    console.log("✅ Blog Updated! Final blog data:", updatedBlog);
    res.json({ message: "Updated Blog!", blog: updatedBlog });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Update failed" });
  }
};
export const deleteBlog = async (req, res) => {
  try {
    const existingBlog = await Blog.findById(req.params.id);
    if (!existingBlog)
      return res.json({ message: "no blog found to delete ! " });

    if (existingBlog.author.toString() !== req.user.id && !req.user.isAdmin)
      return res.json({ message: "not authorized to delete  this " });

    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    console.log("Blog deleted! ");
    res.json({ message: "Blog deleted!", blog: deletedBlog });
  } catch (error) {
    console.error("Error deleting blog !! ", error);
    res.status(500).json({ message: "delete blog Error" });
  }
};
export const getMyBlog = async (req, res) => {
  try {
    console.log('getMyBlog called');
    console.log('req.user:', req.user);

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userId = req.user._id;

    const blogs = await Blog.find({ author: userId })
      .populate("author", "name email isAdmin")
      .sort({ createdAt: -1 });

    console.log(`Found ${blogs.length} blogs for user ${userId}`);

    res.json({
      success: true,
      blogs,
      count: blogs.length,
    });
  } catch (error) {
    console.error("Error in getMyBlog:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const searchBlog = async (req, res) => {
  try {
    const { q, category, sort } = req.query;
    // find blogs where title OR content contains "q"
    const searchQuery = {};

    if (q) {
      searchQuery.$or = [
        { title: { $regex: q, $options: "i" } }, //
        { content: { $regex: q, $options: "i" } },
      ];
    }
    if (category && category != "all") {
      let dbcategory = category;
      if (
        category.toLowerCase() === "gaming" ||
        category.toLowerCase() === "game"
      ) {
        dbcategory = "Game";
      } else if (category.toLowerCase() === "anime") {
        dbcategory = "Anime";
      }
      searchQuery.category = { $regex: category, $options: "i" };
      console.log("🔍 Mapped category:", category, "→", dbcategory);
    }
    const allCategories = await Blog.distinct("category");
    console.log("📊 Categories in database:", allCategories);

    console.log("search with : ", { q, category, sort });
    let sortOptions = { createdAt: -1 }; // sort by  newest default

    if (sort === "oldest") {
      sortOptions = { createdAt: 1 }; // from old to new
    } else if (sort === "alphabetical") {
      sortOptions = { title: 1 }; // from A to Z
    } else if (sort === "popular") {
      sortOptions = { likes: -1 }; // sort by max number of likes
    }

    const findBlog = await Blog.find(searchQuery).sort(sortOptions).limit(10);
    console.log("blog searched : ", findBlog);
    res.json({
      message: "search succesfull",
      blogs: findBlog,
      totalBlogs: findBlog.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
