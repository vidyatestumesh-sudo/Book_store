const mongoose = require("mongoose");

const slideSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    text: { type: String, required: true },
    author: { type: String },
  },
  { _id: false }
);

const cornerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    bgColor: { type: String, default: "#000000" },
    readMoreUrl: { type: String },
    slides: [slideSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Corner", cornerSchema);
