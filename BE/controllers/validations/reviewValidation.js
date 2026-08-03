const Joi = require("joi");
const createReviewValidation = Joi.object({
  trip: Joi.string().hex().length(24).required(),
  rating: Joi.number().min(1).max(5).required().messages({
    "number.min": "Rating must be at least 1",
    "number.max": "Rating cannot exceed 5",
  }),
  comment: Joi.string().min(3).required().messages({
    "string.empty": "Comment cannot be empty",
  }),
});
module.exports = { createReviewValidation };