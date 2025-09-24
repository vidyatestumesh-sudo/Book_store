const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Ensures HTTPS URLs
});

/**
 * Uploads an image buffer to Cloudinary.
 *
 * @param {Buffer} buffer - The image buffer (from multer memoryStorage).
 * @param {string} [folderName="uploads"] - The target folder in Cloudinary.
 * @returns {Promise<Object>} The upload result (contains secure_url, public_id, etc).
 */
const uploadToCloudinary = (buffer, folderName = "uploads") => {
  return new Promise((resolve, reject) => {
    if (!buffer) {
      return reject(new Error("No buffer provided to upload"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: "auto", // Auto-detects file type
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

module.exports = { uploadToCloudinary };
