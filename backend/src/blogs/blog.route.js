const express = require('express');
const router = express.Router();
const multer = require('multer');
 const verifyAdminToken = require('../middleware/verifyAdminToken'); // disabled for testing

const {
    postABlog,
    getAllBlogs,
    getSingleBlog,
    updateBlog,
    deleteBlog
} = require('./blog.controller');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ⚠️ DEV MODE ONLY: Auth temporarily bypassed on create-blog
router.post("/create-blog", upload.single('image'), postABlog);

// ✅ Still protected (restore auth here when ready)
router.get("/", getAllBlogs);
router.get("/:id", getSingleBlog);
router.put("/edit/:id", /* verifyAdminToken, */ upload.single('image'), updateBlog);
router.delete("/:id", /* verifyAdminToken, */ deleteBlog);

module.exports = router;
