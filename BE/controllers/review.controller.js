const Review = require("../models/Review");
const { createReviewValidation } = require("./validations/reviewValidation");


const createReview = async (req, res, next) => {
  try {
    const { error, value } = createReviewValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const mediaUrl = req.file ? req.file.path : null;

    // إعداد الكائن المراد حفظه
    const reviewData = {
      user: req.userId,
      rating: value.rating,
      comment: value.comment,
      media: mediaUrl ? [mediaUrl] : [],
    };

    // إضافة trip فقط إذا كانت موجودة وقيمتها غير فارغة
    if (value.trip && value.trip.trim() !== "") {
      reviewData.trip = value.trip;
    }

    const review = await Review.create(reviewData);

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
const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name userName email") // تجلب بيانات المستخدم صاحب التقييم
      .populate("trip", "title")             // تجلب اسم الرحلة
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    next(err);
  }
};
module.exports = { createReview, getTripReviews ,getAllReviews};