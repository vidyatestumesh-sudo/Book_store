// backend/author/author.controller.js
const Author = require('./author.model');

// Get author content
exports.getAuthorContent = async (req, res) => {
  try {
    const author = await Author.findOne();
    if (!author) {
      return res.status(404).json({ message: "Author content not found" });
    }
    res.json(author);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update or create author content
exports.updateAuthorContent = async (req, res) => {
  try {
    const updatedAuthor = await Author.findOneAndUpdate({}, req.body, { new: true, upsert: true, runValidators: true });
    res.json(updatedAuthor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
