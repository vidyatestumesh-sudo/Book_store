const Blog = require("./blog.model");

// Create blog
const postABlog = async (req, res) => {
  try {
    const { title, description } = req.body;

    // ✅ Image is optional
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newBlog = new Blog({
      title,
      description,
      image: imagePath,
    });

    await newBlog.save();
    res.status(200).send({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to create blog" });
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
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedBlog) return res.status(404).send({ message: "Blog not found" });

    res.status(200).send({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to update blog" });
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

module.exports = {
  postABlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
