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
} = require('./blog.controller');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post("/create-blog", upload.single("image"), postABlog);
router.get("/", getAllBlogs);
router.get("/:id", getSingleBlog);
router.put("/edit/:id", upload.single("image"), updateBlog);
router.delete("/:id", deleteBlog);

module.exports = router;
