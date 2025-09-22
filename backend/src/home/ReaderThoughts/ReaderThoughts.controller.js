const ReaderThoughts = require("./ReaderThoughts.model");
const { google } = require("googleapis");
const fs = require("fs");
require("dotenv").config();

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  process.env.GOOGLE_OAUTH_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
});

async function uploadFileToDrive(filePath, fileName, mimeType) {
  await oauth2Client.getAccessToken();
  const driveService = google.drive({ version: "v3", auth: oauth2Client });

  const fileMetadata = {
    name: fileName,
    parents: [FOLDER_ID],
  };

  const media = {
    mimeType,
    body: fs.createReadStream(filePath),
  };

  const response = await driveService.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id",
  });

  const fileId = response.data.id;

  // Make file public
  await driveService.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  // Return the public view URL
  return `https://drive.google.com/uc?id=${fileId}`;
}

// Get all ReaderThoughts
exports.getAllReaderThoughts = async (req, res) => {
  try {
    const all = await ReaderThoughts.find().sort({ createdAt: -1 });
    res.status(200).json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new ReaderThoughts entry with image upload to Google Drive
exports.createReaderThoughts = async (req, res) => {
  try {
    const { title, thoughts } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const mimeType = req.file.mimetype;

    // Upload image file to Google Drive and get URL
    const imageUrl = await uploadFileToDrive(filePath, fileName, mimeType);

    // Remove local file after upload
    fs.unlinkSync(filePath);

    const newEntry = new ReaderThoughts({
      title,
      image: imageUrl,
      thoughts,
    });

    await newEntry.save();

    res.status(201).json(newEntry);
  } catch (err) {
    console.error("Error creating ReaderThoughts:", err);
    res.status(500).json({ error: err.message });
  }
};
