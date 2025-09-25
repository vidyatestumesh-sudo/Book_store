// controllers/review.controller.js
const Review = require("./review.model");
const Book = require("../books/book.model");

const postReview = async (req, res) => {
  try {
    const { id: bookId } = req.params;
    const { userId, userName, rating, comment } = req.body;

    if (!userId || !userName || !rating || !comment) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).send({ message: "Book not found" });

    // Check if user already reviewed
    let existingReview = await Review.findOne({ bookId, userId });

    if (existingReview) {
      // Update the existing review
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.userName = userName;
      await existingReview.save();
    } else {
      // Create new review
      const newReview = new Review({ bookId, userId, userName, rating, comment });
      await newReview.save();
    }

    // Return updated list of reviews
    const reviews = await Review.find({ bookId }).sort({ createdAt: -1 });

    res.status(200).send({
      message: "Review submitted successfully",
      reviews,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).send({ message: "Failed to submit or update review" });
  }
};

const getReviewsByBook = async (req, res) => {
  try {
    const { id: bookId } = req.params;
    const reviews = await Review.find({ bookId }).sort({ createdAt: -1 });
    res.status(200).send(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).send({ message: "Failed to fetch reviews" });
  }
};

module.exports = {
  postReview,
  getReviewsByBook,
};
