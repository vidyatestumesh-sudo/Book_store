const mongoose = require("mongoose");

const thoughtSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
});

const readerThoughtsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },  // Google Drive image URL
  thoughts: [thoughtSchema],
}, { timestamps: true });

module.exports = mongoose.model("ReaderThoughts", readerThoughtsSchema);
