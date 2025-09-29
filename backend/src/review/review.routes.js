const express = require("express");
const router = express.Router();

const {
  postReview,
  getReviewsByBook,
  getAllHighRatedReviews,
  toggleReviewApproval,
  getAllReviewsForAdmin, // <-- imported properly
} = require("./review.controller");

// Admin route: fetch all reviews
router.get("/admin", getAllReviewsForAdmin);

// POST a review for a specific book
router.post("/:id/review", postReview);

// GET all reviews for a specific book
router.get("/:id/reviews", getReviewsByBook);

// GET approved reviews with rating > 3 (homepage)
router.get("/all", getAllHighRatedReviews);

// PATCH approve/unapprove review
router.patch("/:id/approve", toggleReviewApproval);

module.exports = router;
