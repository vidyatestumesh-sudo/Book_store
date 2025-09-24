const Corner = require('./corner.model');
const { uploadToCloudinary } = require('../../config/cloudinary');

// Uploads a single file buffer to Cloudinary, returns the URL
async function handleImageUpload(file, folder = "corners") {
  if (!file || !file.buffer) return null;
  const result = await uploadToCloudinary(file.buffer, folder);
  return result.secure_url;
}

// GET /api/home/corners - fetch all corners sorted by id
const getCorners = async (req, res) => {
  try {
    const corners = await Corner.find().sort({ id: 1 });
    return res.json(corners);
  } catch (err) {
    console.error("Error in getCorners:", err);
    return res.status(500).json({ error: "Failed to fetch corners" });
  }
};

// POST /api/home/corners - upsert corners with images
const upsertCorners = async (req, res) => {
  try {
    // Parse corners JSON string sent in req.body.corners
    const cornersData = JSON.parse(req.body.corners);

    // req.files is an array of uploaded files from multer
    const files = req.files || [];

    // Map files by their fieldname for quick lookup
    const fileMap = {};
    files.forEach((file) => {
      fileMap[file.fieldname] = file;
    });

    // Loop over corners and slides, upload any new images and replace slide.image URLs
    for (let c = 0; c < cornersData.length; c++) {
      const corner = cornersData[c];
      for (let s = 0; s < corner.slides.length; s++) {
        const slide = corner.slides[s];
        const fileKey = `corner_${corner.id}_slide_${s}_image`;

        if (fileMap[fileKey]) {
          // Upload file buffer to Cloudinary
          const url = await handleImageUpload(fileMap[fileKey], "corners");
          slide.image = url;
        }
        // else keep existing slide.image as is (no change)
      }
    }

    // Upsert corners into DB by id
    const upserts = await Promise.all(
      cornersData.map((corner) =>
        Corner.findOneAndUpdate(
          { id: corner.id },
          corner,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      )
    );

    return res.json(upserts);
  } catch (err) {
    console.error("Error in upsertCorners:", err);
    return res.status(500).json({ error: "Failed to save corners" });
  }
};

module.exports = {
  getCorners,
  upsertCorners,
};
