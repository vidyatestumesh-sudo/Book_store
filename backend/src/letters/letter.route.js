const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const { uploadLetter, getAllLetters } = require('./letter.controller');
const Letter = require('./letter.model');

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const title = req.body.title || file.originalname;
    const safeFileName = title.trim().replace(/\s+/g, '_').toLowerCase();

    return {
      folder: 'letters',
      resource_type: 'raw',
      format: 'pdf', // Enforce .pdf format
      public_id: safeFileName, // e.g., "my_letter"
      allowed_formats: ['pdf'],
    };
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('pdf'), uploadLetter);

router.get('/', getAllLetters);

router.put('/:id', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const updated = await Letter.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Letter not found' });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating letter:", error);
    res.status(500).json({ message: 'Update failed' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const letter = await Letter.findById(req.params.id);
    if (!letter) return res.status(404).json({ message: 'Letter not found' });

    const fileUrlParts = letter.fileUrl.split('/');
    const fileNameWithExt = fileUrlParts[fileUrlParts.length - 1];
    const publicId = fileNameWithExt.replace('.pdf', '');

    await cloudinary.uploader.destroy(`letters/${publicId}`, {
      resource_type: 'raw',
    });

    await Letter.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Letter deleted successfully' });
  } catch (error) {
    console.error("Error deleting letter:", error);
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;
