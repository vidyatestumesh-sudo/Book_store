const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    userId: { type: String, required: true },       // Firebase UID (string)
    userName: { type: String, required: true },     // From Firebase user displayName or email
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
