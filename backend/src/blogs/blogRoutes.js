const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const blogController = require("./blog.controller");
const verifyAdminToken = require("../middleware/verifyAdminToken");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getSingleBlog);

// Admin routes
router.post("/", verifyAdminToken, upload.single("image"), blogController.createBlog);
router.put("/:id", verifyAdminToken, upload.single("image"), blogController.updateBlog);
router.delete("/:id", verifyAdminToken, blogController.deleteBlog);

module.exports = router;
