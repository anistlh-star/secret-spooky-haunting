// imageController.js - SUPER SIMPLE

import Blog from "../models/Blog.js";

export const imageHandle = async (req, res) => {
  try {
    // req.file is available because of upload.single("image") in routes
    if (!req.file) {
      return res.status(400).json({ message: "No image selected!" });
    }

    // ✅ Success!
    res.json({ 
      message: "Image uploaded!",
      imageFile: req.file.filename 
    });

  } catch (error) {
    res.status(500).json({ message: "Upload failed!" });
  }
};

export const removeBlogImage =async(req,res)=>{

try {
    const { id } = req.params;
    
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Check authorization
    if (blog.author.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this blog" });
    }

    // Remove the image
    blog.image = null;
    await blog.save();
    
    res.json({ message: "Image removed successfully!", blog });
  } catch (error) {
    res.status(500).json({ message: "Error removing image", error });
  }



}