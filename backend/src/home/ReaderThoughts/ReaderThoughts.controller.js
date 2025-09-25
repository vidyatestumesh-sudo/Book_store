const ReaderThoughts = require("./ReaderThoughts.model");
const { uploadToCloudinary } = require("../../config/cloudinary");
const fs = require("fs");

exports.getReaderThoughts = async (req, res) => {
  try {
    const doc = await ReaderThoughts.findOne();
    if (!doc) return res.status(404).json({ message: "No Reader Thoughts found" });
    res.json(doc);
  } catch (err) {
    console.error("Error in getReaderThoughts:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.createOrUpdateReaderThoughts = async (req, res) => {
  try {
    const { title, thoughts } = req.body;
    const parsedThoughts = typeof thoughts === "string" ? JSON.parse(thoughts) : thoughts;

    let imageData = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "reader_thoughts");
      imageData = {
        url: result.secure_url,
        mimeType: req.file.mimetype,
      };
    }

    let doc = await ReaderThoughts.findOne();

    if (!doc) {
      doc = new ReaderThoughts({
        title,
        image: imageData,
        thoughts: parsedThoughts,
      });
      await doc.save();
      return res.status(201).json(doc);
    }

    if (title) doc.title = title;
    if (imageData) doc.image = imageData;
    if (Array.isArray(parsedThoughts)) doc.thoughts = parsedThoughts;

    await doc.save();
    res.status(200).json(doc);
  } catch (err) {
    console.error("Error in createOrUpdateReaderThoughts:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteThoughtById = async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const doc = await ReaderThoughts.findOne();
    if (!doc) return res.status(404).json({ message: "Document not found" });

    doc.thoughts = doc.thoughts.filter((t) => t._id.toString() !== thoughtId);
    await doc.save();
    res.status(200).json(doc);
  } catch (err) {
    console.error("Error in deleteThoughtById:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateThoughtById = async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const { title, text, author } = req.body;

    const doc = await ReaderThoughts.findOne();
    if (!doc) return res.status(404).json({ message: "Document not found" });

    const thought = doc.thoughts.id(thoughtId);
    if (!thought) return res.status(404).json({ message: "Thought not found" });

    if (title) thought.title = title;
    if (text) thought.text = text;
    if (author) thought.author = author;

    await doc.save();
    res.status(200).json(doc);
  } catch (err) {
    console.error("Error in updateThoughtById:", err);
    res.status(500).json({ error: err.message });
  }
};
