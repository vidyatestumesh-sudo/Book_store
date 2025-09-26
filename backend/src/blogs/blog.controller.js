const Blog = require("./blog.model");
const { uploadToCloudinary } = require("../config/cloudinary");

// Create blog
const postABlog = async (req, res) => {
  try {
    const { title, description, type } = req.body;
    let imageUrl = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "blogs");
      imageUrl = result.secure_url;
    }

    const newBlog = new Blog({
      title,
      description,
      image: imageUrl,
      type, // assuming you want to distinguish between "inspiration" or others
    });

    await newBlog.save();
    res.status(200).send({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    console.error("❌ Failed to create blog:", error);
    res.status(500).send({ message: "Failed to create blog", error: error.message });
  }
};

// Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).send(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to fetch blogs" });
  }
};

// Get single blog
const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).send({ message: "Blog not found" });
    res.status(200).send(blog);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to fetch blog" });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "blogs");
      updateData.image = result.secure_url;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedBlog) return res.status(404).send({ message: "Blog not found" });

    res.status(200).send({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    console.error("❌ Failed to update blog:", error);
    res.status(500).send({ message: "Failed to update blog", error: error.message });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return res.status(404).send({ message: "Blog not found" });

    res.status(200).send({ message: "Blog deleted successfully", blog: deletedBlog });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to delete blog" });
  }
};

// Suspend / Unsuspend blog
const suspendBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).send({ message: "Blog not found" });

    blog.suspended = !blog.suspended; // toggle
    await blog.save();

    res.status(200).send({
      message: `Blog ${blog.suspended ? "suspended" : "active"}`,
      blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to update blog suspension" });
  }
};

module.exports = {
  postABlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  suspendBlog,
};
