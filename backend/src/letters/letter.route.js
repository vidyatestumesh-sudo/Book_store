const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const { uploadLetter } = require('./letter.controller');

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'letters',
    resource_type: 'raw',
    allowed_formats: ['pdf'],
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('pdf'), uploadLetter);

module.exports = router;
