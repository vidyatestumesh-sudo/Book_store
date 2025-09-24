const Corner = require("./corner.model");
const cloudinary = require("../../config/cloudinary");

// Cloudinary Upload Helper
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    stream.end(buffer);
  });
};

// GET all corners
const getCorners = async (req, res) => {
  try {
    const corners = await Corner.find();
    res.json(corners);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET single corner
const getCornerById = async (req, res) => {
  try {
    const corner = await Corner.findById(req.params.id);
    if (!corner) return res.status(404).json({ message: "Corner not found" });
    res.json(corner);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE corner
const createCorner = async (req, res) => {
  try {
    const { title, bgColor, readMoreUrl } = req.body;
    let slides = [];

    if (req.body.slides) {
      slides = JSON.parse(req.body.slides); // if sent as stringified JSON
    }

    if (req.files?.slides) {
      for (let i = 0; i < req.files.slides.length; i++) {
        const file = req.files.slides[i];
        const result = await uploadToCloudinary(file.buffer, "corners");
        slides[i].image = result.secure_url;
      }
    }

    const corner = new Corner({ title, bgColor, readMoreUrl, slides });
    await corner.save();
    res.status(201).json({ message: "Corner created", corner });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Create failed" });
  }
};

// UPDATE corner
const updateCorner = async (req, res) => {
  try {
    const { title, bgColor, readMoreUrl } = req.body;
    let slides = [];

    if (req.body.slides) {
      slides = JSON.parse(req.body.slides);
    } else {
      // rebuild slides from fields like slides[0][text]
      const parsedSlides = [];
      Object.keys(req.body).forEach((key) => {
        const match = key.match(/^slides\[(\d+)\]\[(.+)\]$/);
        if (match) {
          const index = parseInt(match[1]);
          const field = match[2];
          parsedSlides[index] = parsedSlides[index] || {};
          parsedSlides[index][field] = req.body[key];
        }
      });
      slides = parsedSlides;
    }

    if (req.files?.slides) {
      for (let i = 0; i < req.files.slides.length; i++) {
        const file = req.files.slides[i];
        const result = await uploadToCloudinary(file.buffer, "corners");
        slides[i].image = result.secure_url;
      }
    }

    const corner = await Corner.findByIdAndUpdate(
      req.params.id,
      { title, bgColor, readMoreUrl, slides },
      { new: true }
    );

    if (!corner) return res.status(404).json({ message: "Corner not found" });
    res.json({ message: "Corner updated", corner });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

// DELETE corner
const deleteCorner = async (req, res) => {
  try {
    const corner = await Corner.findByIdAndDelete(req.params.id);
    if (!corner) return res.status(404).json({ message: "Corner not found" });
    res.json({ message: "Corner deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

module.exports = {
  getCorners,
  getCornerById,
  createCorner,
  updateCorner,
  deleteCorner,
};
