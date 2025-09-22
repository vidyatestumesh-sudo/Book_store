const Banner = require("./banner.model");
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

// GET Banner
const getBanner = async (req, res) => {
  try {
    const banner = await Banner.findOne(); // You can make it by ID if needed
    if (!banner) return res.status(404).json({ message: "No banner found" });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE Banner
const updateBanner = async (req, res) => {
  try {
    const { title, description, quote, starsCount } = req.body;
    const updateData = { title, description, quote, starsCount };

    if (req.files?.logo) {
      const result = await uploadToCloudinary(req.files.logo[0].buffer, "banner");
      updateData.logoUrl = result.secure_url;
    }

    if (req.files?.image) {
      const result = await uploadToCloudinary(req.files.image[0].buffer, "banner");
      updateData.imageUrl = result.secure_url;
    }

    let banner = await Banner.findOne();
    if (!banner) {
      banner = new Banner(updateData);
    } else {
      Object.assign(banner, updateData);
    }

    await banner.save();
    res.json({ message: "Banner updated", banner });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

module.exports = {
  getBanner,
  updateBanner,
};
