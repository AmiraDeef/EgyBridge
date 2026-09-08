const Joi = require("joi");

const createReviewValidation = Joi.object({
  // trip is purely optional — only sent when a valid 24-char hex ObjectId is available
  trip: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow("", null)
    .messages({
      "string.pattern.base": "trip must be a valid 24-character hexadecimal ObjectId",
    }),
  // FormData sends numbers as strings, so we need convert:true (set below via .options())
  rating: Joi.number().min(1).max(5).required().messages({
    "number.min": "Rating must be at least 1",
    "number.max": "Rating cannot exceed 5",
    "number.base": "Rating must be a number",
  }),
  comment: Joi.string().min(3).required().messages({
    "string.empty": "Comment cannot be empty",
    "string.min": "Comment must be at least 3 characters",
  }),
  userName: Joi.string().optional().allow("", null),
  media: Joi.any().optional(),
}).options({ convert: true }); // converts FormData strings (e.g. "5") to their proper types

module.exports = { createReviewValidation };