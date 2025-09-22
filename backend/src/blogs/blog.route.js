const express = require('express');
const router = express.Router();
const multer = require('multer');
// const verifyAdminToken = require('../middleware/verifyAdminToken'); // enable later

const {
  postABlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  suspendBlog,
} = require('./blog.controller');

// Use memory storage for Cloudinary upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post("/create-blog", upload.single("image"), postABlog);
router.get("/", getAllBlogs);
router.get("/:id", getSingleBlog);
router.put("/edit/:id", upload.single("image"), updateBlog);
router.delete("/:id", deleteBlog);
router.put("/suspend/:id", suspendBlog); // new route

module.exports = router;
