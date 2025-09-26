const express = require("express");
const router = express.Router();

const {
  postReview,
  getReviewsByBook,
  getAllHighRatedReviews,
} = require("./review.controller");

// POST a review for a specific book by bookId
router.post("/:id/review", postReview);

// GET all reviews for a specific book by bookId
router.get("/:id/reviews", getReviewsByBook);

// GET all reviews with rating > 3 (across all books)
router.get("/all", getAllHighRatedReviews);

module.exports = router;
