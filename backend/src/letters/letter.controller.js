const Letter = require('./letter.model');

const uploadLetter = async (req, res) => {
  try {
    const { title } = req.body;
    const fileUrl = req.file.path; // Cloudinary URL

    const letter = new Letter({ title, fileUrl });
    await letter.save();

    res.status(201).json({ success: true, letter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
};

module.exports = { uploadLetter };
