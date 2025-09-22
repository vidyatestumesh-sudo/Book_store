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

// 🔁 Uploads a file to Google Drive and returns a public image URL
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

  // Make file publicly accessible
  await driveService.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return `https://drive.google.com/uc?id=${fileId}`;
}

// ✅ Get the single ReaderThoughts document
exports.getReaderThoughts = async (req, res) => {
  try {
    const doc = await ReaderThoughts.findOne();
    res.status(200).json(doc || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Create or update ReaderThoughts (singleton behavior)
exports.createOrUpdateReaderThoughts = async (req, res) => {
  try {
    const { title, thoughts } = req.body;
    const parsedThoughts = typeof thoughts === "string" ? JSON.parse(thoughts) : thoughts;

    let imageUrl = null;

    if (req.file) {
      const filePath = req.file.path;
      const fileName = req.file.originalname;
      const mimeType = req.file.mimetype;

      imageUrl = await uploadFileToDrive(filePath, fileName, mimeType);
      fs.unlinkSync(filePath); // clean up
    }

    let doc = await ReaderThoughts.findOne();

    if (!doc) {
      // First-time creation
      doc = new ReaderThoughts({
        title,
        image: imageUrl,
        thoughts: parsedThoughts,
      });

      await doc.save();
      return res.status(201).json(doc);
    }

    // Update title or image if provided
    if (title) doc.title = title;
    if (imageUrl) doc.image = imageUrl;

    // Replace all thoughts if provided (optional behavior, adjust if needed)
    if (Array.isArray(parsedThoughts)) {
      doc.thoughts = parsedThoughts;
    }

    await doc.save();
    res.status(200).json(doc);
  } catch (err) {
    console.error("Error in createOrUpdateReaderThoughts:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete a specific thought by _id
exports.deleteThoughtById = async (req, res) => {
  try {
    const { thoughtId } = req.params;

    const updated = await ReaderThoughts.findOneAndUpdate(
      {},
      { $pull: { thoughts: { _id: thoughtId } } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Document not found" });

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update a specific thought by _id
exports.updateThoughtById = async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const { title, text } = req.body;

    const doc = await ReaderThoughts.findOne();
    if (!doc) return res.status(404).json({ error: "Document not found" });

    const thought = doc.thoughts.id(thoughtId);
    if (!thought) return res.status(404).json({ error: "Thought not found" });

    if (title) thought.title = title;
    if (text) thought.text = text;

    await doc.save();

    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
