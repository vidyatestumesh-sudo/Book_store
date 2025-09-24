// src/author/author.controller.js
const Author = require('./author.model');
const { uploadToCloudinary } = require('../config/cloudinary');
const { v4: uuidv4 } = require('uuid');

/**
 * Upload a single image file to Cloudinary
 */
async function handleImageUpload(file, defaultAlt = 'Uploaded Image') {
  if (!file || !file.buffer) return null;

  const result = await uploadToCloudinary(file.buffer, 'author');
  return {
    src: result.secure_url,
    alt: file.originalname || defaultAlt || uuidv4(),
  };
}

/**
 * GET /api/author
 * Fetch the singleton author content
 */
async function getAuthorContent(req, res) {
  try {
    const content = await Author.findById('singleton_author');

    if (!content) {
      return res.status(404).json({ error: 'Author content not found' });
    }

    return res.status(200).json(content);
  } catch (error) {
    console.error('❌ Get Author Error:', error);
    return res.status(500).json({ error: 'Failed to fetch author content' });
  }
}

/**
 * POST /api/author
 * Create or update the singleton author content
 */
async function upsertAuthorContent(req, res) {
  try {
    const data = JSON.parse(req.body.data); // Receive JSON body as string
    const files = req.files;

    // Upload images conditionally
    if (files?.motifImage?.[0]) {
      data.sectionHeading.motifImage = await handleImageUpload(files.motifImage[0], 'Motif Image');
    }

    if (files?.rightImage?.[0]) {
      data.aboutAuthor.rightImage = await handleImageUpload(files.rightImage[0], 'About Author Right Image');
    }

    if (files?.leftImage?.[0]) {
      data.workingCreed.leftImage = await handleImageUpload(files.leftImage[0], 'Working Creed Left Image');
    }

    const updated = await Author.findOneAndUpdate(
      { _id: 'singleton_author' },
      { ...data, _id: 'singleton_author' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json(updated);
  } catch (error) {
    console.error('❌ Upsert Author Error:', error);
    return res.status(500).json({ error: 'Failed to save author content' });
  }
}

module.exports = {
  getAuthorContent,
  upsertAuthorContent,
};
