const express = require("express");
const router = express.Router();
const {
  createReview,
  getTripReviews,
} = require("../controllers/review.controller");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createReview);
router.get("/:tripId", getTripReviews); // public — no auth needed to read reviews

module.exports = router;
