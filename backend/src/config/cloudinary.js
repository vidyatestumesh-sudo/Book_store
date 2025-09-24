const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Use HTTPS URLs
});

/**
 * Uploads an image buffer to Cloudinary inside a specified folder.
 * @param {Buffer} buffer - The image buffer to upload.
 * @param {string} folderName - The folder name in Cloudinary (default: "uploads").
 * @returns {Promise<Object>} The Cloudinary upload result.
 */
const uploadToCloudinary = async (buffer, folderName = "uploads") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: "auto", // detects image/video/raw automatically
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        // Uncomment the next line if you want to log successful uploads
        // console.log("Cloudinary upload successful:", result.secure_url);
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

module.exports = { uploadToCloudinary };
