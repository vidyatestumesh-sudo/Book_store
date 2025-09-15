const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String }, // store image path/url
    author: { type: String, default: "Admin" }, // optional
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
