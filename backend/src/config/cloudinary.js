// src/config/cloudinary.js
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Use HTTPS
});

// Function to upload an image buffer to Cloudinary
const uploadToCloudinary = async (buffer, folderName = "uploads") => {
  return new Promise((resolve, reject) => {
    // Create an upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName, // Specify a folder in Cloudinary
        resource_type: "auto", // Automatically detect file type
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        resolve(result); // result contains secure_url, public_id, etc.
      }
    );
    // Pipe the buffer to the upload stream
    uploadStream.end(buffer);
  });
};

module.exports = { cloudinary, uploadToCloudinary };