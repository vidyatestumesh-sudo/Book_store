const InspirationImage = require("./inspirationImage.model");
const { cloudinary } = require("../config/cloudinary");

// Helper to upload image buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = "inspirations") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(buffer);
  });
};

const handleImageUpload = async (file, folder = "inspirations") => {
  if (!file || !file.buffer) return null;
  const result = await uploadToCloudinary(file.buffer, folder);
  return {
    imageUrl: result.secure_url,
    cloudinaryId: result.public_id,
  };
};

// GET /api/inspiration-images
exports.getImages = async (req, res) => {
  try {
    const images = await InspirationImage.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    console.error("Failed to fetch inspiration images", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/inspiration-images/upload
exports.uploadImage = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No image uploaded" });

    const result = await handleImageUpload(file);
    if (!result) return res.status(500).json({ message: "Cloudinary upload failed" });

    const newImage = new InspirationImage({
      title: title || "",
      imageUrl: result.imageUrl,
      cloudinaryId: result.cloudinaryId,
    });

    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    console.error("Upload error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/inspiration-images/:id
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await InspirationImage.findById(id);
    if (!image) return res.status(404).json({ message: "Not found" });

    // Delete from Cloudinary
    if (image.cloudinaryId) {
      await cloudinary.uploader.destroy(image.cloudinaryId);
    }

    await image.deleteOne();
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("Delete error", err);
    res.status(500).json({ message: "Server error" });
  }
};
