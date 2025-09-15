const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: String, // You can replace with ObjectId if you have Users
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    aboutBook: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String },
    backImage: { type: String },
    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    discount: { type: Number },
    specifications: {
      language: { type: String, required: true },
      binding: { type: String },
      publisher: { type: String, required: true },
      isbn: { type: String, required: true },
      publishingDate: { type: String, required: true },
      pages: { type: Number },
    },
    createdAt: { type: Date, default: Date.now },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
