const express = require("express");
const router = express.Router();
const {
  createReview,
  getTripReviews,
  getAllReviews
} = require("../controllers/review.controller");
const { uploadReviewMedia } = require("../middlewares/upload");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, uploadReviewMedia, createReview);
router.get("/", getAllReviews);          // must be before /:tripId
router.get("/:tripId", getTripReviews); // public — no auth needed to read reviews
module.exports = router;
