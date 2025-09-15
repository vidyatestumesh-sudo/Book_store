const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const { uploadLetter, getAllLetters } = require('./letter.controller');
const Letter = require('./letter.model');
const axios = require('axios');

const router = express.Router();

// Multer file filter to only accept PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const title = req.body.title || file.originalname;
    const safeFileName = title.trim().replace(/\s+/g, '_').toLowerCase();

    return {
      folder: 'letters',
      resource_type: 'raw',
      format: 'pdf',
      public_id: safeFileName,
      allowed_formats: ['pdf'],
    };
  },
});

const upload = multer({ storage, fileFilter });

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

// Route to stream PDF from Cloudinary with signed URL
router.get('/pdf/:publicId', async (req, res) => {
  const publicId = req.params.publicId;

  const cloudinaryUrl = cloudinary.url(`letters/${publicId}`, {
    resource_type: 'raw',
    format: 'pdf',
    sign_url: true, // Signed URL to avoid 401 unauthorized
  });

  try {
    const response = await axios.get(cloudinaryUrl, {
      responseType: 'stream',
    });

    // Confirm content-type is PDF before streaming
    if (response.headers['content-type'] !== 'application/pdf') {
      return res.status(400).send('Requested file is not a PDF');
    }

    // Set headers to display inline PDF in browser
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${publicId}.pdf"`);

    // Pipe the PDF stream to the client
    response.data.pipe(res);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error('PDF not found on Cloudinary:', error.message);
      res.status(404).send('PDF not found');
    } else {
      console.error('Error fetching PDF from Cloudinary:', error.message);
      res.status(500).send('Error fetching PDF');
    }
  }
});

module.exports = router;
