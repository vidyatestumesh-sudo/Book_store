const Review = require("./review.model");
const Book = require("../books/book.model");

// POST a review for a book
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

// GET reviews for a book
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

// GET approved reviews with rating > 3 (for homepage)
const getAllHighRatedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ rating: { $gt: 2 }, approved: true })
      .sort({ createdAt: -1 })
      .populate("bookId", "title") // <-- populate the book title only
      .lean();

    // Map to include bookName
    const formattedReviews = reviews.map((r) => ({
      ...r,
      bookName: r.bookId?.title || "Unknown Book",
    }));

    res.status(200).send(formattedReviews);
  } catch (error) {
    console.error("Error fetching high-rated reviews:", error);
    res.status(500).send({ message: "Failed to fetch reviews" });
  }
};

// Admin route: GET all reviews (approved + unapproved)
const getAllReviewsForAdmin = async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .populate("bookId", "title")
      .lean();

    const formattedReviews = reviews.map((r) => ({
      ...r,
      bookName: r.bookId?.title || "Unknown Book",
    }));

    res.status(200).send(formattedReviews);
  } catch (error) {
    console.error("Error fetching all reviews for admin:", error);
    res.status(500).send({ message: "Failed to fetch reviews" });
  }
};

// PATCH approve/unapprove review
const toggleReviewApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    const review = await Review.findByIdAndUpdate(
      id,
      { approved },
      { new: true }
    ).populate("bookId", "title"); // <-- populate book title

    if (!review) {
      return res.status(404).send({ message: "Review not found" });
    }

    // Add bookName for frontend
    const formattedReview = {
      ...review.toObject(),
      bookName: review.bookId?.title || "Unknown",
    };

    res.status(200).send({ message: "Review updated successfully", review: formattedReview });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).send({ message: "Failed to update review" });
  }
};


module.exports = {
  postReview,
  getReviewsByBook,
  getAllHighRatedReviews,
  toggleReviewApproval,
  getAllReviewsForAdmin, // <-- make sure this is exported
};
