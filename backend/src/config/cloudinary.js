const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Ensures HTTPS URLs
});

/**
 * Uploads an image buffer to Cloudinary using upload_stream.
 *
 * @param {Buffer} buffer - The image buffer from multer's memoryStorage.
 * @param {string} [folder="uploads"] - Folder name in Cloudinary (default: "uploads").
 * @param {string} [publicId] - Optional custom public_id for the file.
 * @returns {Promise<{
 *   secure_url: string;
 *   public_id: string;
 *   resource_type: string;
 *   format: string;
 *   bytes: number;
 *   created_at: string;
 * }>} Cloudinary upload result
 */
const uploadToCloudinary = (buffer, folder = "uploads", publicId) => {
  return new Promise((resolve, reject) => {
    if (!buffer) {
      return reject(new Error("No image buffer provided for upload."));
    }

    const options = {
      folder,
      resource_type: "auto",
    };

    if (publicId) {
      options.public_id = publicId;
    }

    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) {
        console.error("❌ Cloudinary upload failed:", err);
        return reject(new Error("Cloudinary upload error: " + err.message));
      }

      console.log("✅ Uploaded to Cloudinary:", {
        url: result.secure_url,
        id: result.public_id,
      });

      resolve(result);
    });

    stream.end(buffer);
  });
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
};
