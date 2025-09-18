const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    aboutBook: { type: String },
    description: { type: String, required: true },
    coverImage: { type: String },
    backImage: { type: String },
    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    discount: { type: Number },
    language: { type: String },
    binding: { type: String },
    publisher: { type: String },
    isbn: { type: String },
    publishingDate: { type: String },
    pages: { type: Number },
    sold: { type: Number, default: 1 },
    stock: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
