const mongoose = require('mongoose');

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
  }
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  coverImage: { type: String },
  oldPrice: { type: Number, required: true },
  newPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  reviews: [reviewSchema],   // 🔹 Add reviews array
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
