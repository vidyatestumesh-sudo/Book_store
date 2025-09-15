const Letter = require('./letter.model');

const uploadLetter = async (req, res) => {
  try {
    const { title } = req.body;
    const fileUrl = req.file.path;
    const fileName = req.file.originalname; 

    const letter = new Letter({ title, fileUrl,fileName });
    await letter.save();

    res.status(201).json({ success: true, letter });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
};

const getAllLetters = async (req, res) => {
  try {
    const letters = await Letter.find().sort({ uploadedAt: -1 });
    res.status(200).json(letters);
  } catch (error) {
    console.error('Fetching letters failed:', error);
    res.status(500).json({ message: 'Failed to fetch letters' });
  }
};

module.exports = {
  uploadLetter,
  getAllLetters,
};
