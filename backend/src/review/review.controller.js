const Review = require("./review.model");
const Book = require("../books/book.model");

const postReview = async (req, res) => {
  try {
    const { id: bookId } = req.params;
    const { userId, userName, rating, comment } = req.body;

    // Validate required fields
    if (!userId || !userName || !rating || !comment) {
      return res.status(400).send({ message: "All fields are required" });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).send({ message: "Book not found" });

    // Create review
    const newReview = new Review({ bookId, userId, userName, rating, comment });
    await newReview.save();

    res.status(201).send({ message: "Review submitted successfully", review: newReview });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).send({ message: "Failed to submit review" });
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
