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

    // Check if user already reviewed this book
    let existingReview = await Review.findOne({ bookId, userId });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.userName = userName;
      await existingReview.save();
    } else {
      const newReview = new Review({ bookId, userId, userName, rating, comment });
      await newReview.save();
    }

    // Return updated reviews
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

// NEW: Get all reviews with rating > 3 regardless of book
const getAllHighRatedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ rating: { $gt: 3 } }).sort({ createdAt: -1 }).lean();
    res.status(200).send(reviews);
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).send({ message: "Failed to fetch all reviews" });
  }
};

module.exports = {
  postReview,
  getReviewsByBook,
  getAllHighRatedReviews,
};
