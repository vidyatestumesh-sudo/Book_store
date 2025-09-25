const express = require("express");
const router = express.Router();

const { postReview, getReviewsByBook } = require("./review.controller");

// POST a review for a book
router.post("/:id/review", postReview);

// GET all reviews for a book
router.get("/:id/reviews", getReviewsByBook);

module.exports = router;
