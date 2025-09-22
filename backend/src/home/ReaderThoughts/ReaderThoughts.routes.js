const express = require("express");
const router = express.Router();
const controller = require("./ReaderThoughts.controller");
const multer = require("multer");

// ✅ Use memory storage so we can upload the buffer directly to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET the singleton ReaderThoughts document
router.get("/", controller.getReaderThoughts);

// POST to create or update (image/pdf + thoughts)
router.post("/", upload.single("file"), controller.createOrUpdateReaderThoughts);

// DELETE a specific thought
router.delete("/thought/:thoughtId", controller.deleteThoughtById);

// PATCH to edit a specific thought
router.patch("/thought/:thoughtId", controller.updateThoughtById);

module.exports = router;
