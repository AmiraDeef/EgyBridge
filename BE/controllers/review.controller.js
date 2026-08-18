const Review = require("../models/Review");
const { createReviewValidation } = require("./validations/reviewValidation");


const createReview = async (req, res, next) => {
  try {
    const { error, value } = createReviewValidation.validate(req.body);

    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const review = await Review.create({
      user: req.userId, // set by authMiddleware
      trip: value.trip,
      rating: value.rating,
      comment: value.comment,
    });

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (err) {
    next(err);
  }
};

const getTripReviews = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    const reviews = await Review.find({ trip: tripId })
      .populate("user", "fullName")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    next(err);
  }
};
module.exports = { createReview, getTripReviews };