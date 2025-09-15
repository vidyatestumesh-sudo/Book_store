const Blog = require("./blog.model");

// Create a blog
const createBlog = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newBlog = new Blog({ title, content, author, image });
    await newBlog.save();

    res.status(201).send({ message: "Blog created successfully", blog: newBlog });
  } catch (err) {
    console.error("Error creating blog", err);
    res.status(500).send({ message: "Failed to create blog" });
  }
};

// Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).send(blogs);
  } catch (err) {
    console.error("Error fetching blogs", err);
    res.status(500).send({ message: "Failed to fetch blogs" });
  }
};

// Get single blog
const getSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).send({ message: "Blog not found" });

    res.status(200).send(blog);
  } catch (err) {
    console.error("Error fetching blog", err);
    res.status(500).send({ message: "Failed to fetch blog" });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content, author, ...(image && { image }) },
      { new: true }
    );

    if (!updatedBlog) return res.status(404).send({ message: "Blog not found" });

    res.status(200).send({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (err) {
    console.error("Error updating blog", err);
    res.status(500).send({ message: "Failed to update blog" });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) return res.status(404).send({ message: "Blog not found" });

    res.status(200).send({ message: "Blog deleted successfully", blog: deletedBlog });
  } catch (err) {
    console.error("Error deleting blog", err);
    res.status(500).send({ message: "Failed to delete blog" });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
