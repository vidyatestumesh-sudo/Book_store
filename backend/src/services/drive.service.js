const fs = require('fs');
const { google } = require('googleapis');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set the credentials using the refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

// Upload a file to Google Drive
async function uploadFileToDrive(filePath, fileName) {
  try {
    const fileMetadata = {
      name: fileName,
      parents: [FOLDER_ID],
    };

    const media = {
      mimeType: 'application/pdf', // adjust if you're uploading different types
      body: fs.createReadStream(filePath),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id',
    });

    // Make it public
    await drive.permissions.create({
      fileId: file.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return `https://drive.google.com/uc?id=${file.data.id}&export=download`;
  } catch (error) {
    console.error('Upload to Google Drive failed:', error);
    throw error;
  }
}

module.exports = {
  uploadFileToDrive,
};
