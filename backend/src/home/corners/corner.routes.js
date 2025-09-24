const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getCorners,
  getCornerById,
  createCorner,
  updateCorner,
  deleteCorner,
} = require("./corner.controller");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get all
router.get("/", getCorners);

// Get one
router.get("/:id", getCornerById);

// Create
router.post("/", upload.array("slides"), createCorner);

// Update
router.put("/:id", upload.array("slides"), updateCorner);

// Delete
router.delete("/:id", deleteCorner);

module.exports = router;
