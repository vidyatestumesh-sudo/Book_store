const express = require("express");
const router = express.Router();
const controller = require("./ReaderThoughts.controller");
const multer = require("multer");
const path = require("path");

// Multer config for file upload to temp folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // ensure this folder exists
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

// Routes
router.get("/", controller.getAllReaderThoughts);
router.post("/", upload.single("image"), controller.createReaderThoughts);

module.exports = router;
