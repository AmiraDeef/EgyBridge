const Joi = require("joi");

const createReviewValidation = Joi.object({
  // استخدام pattern مخصص يضمن قبول ObjectId 24 حرف فقط، أو نص فارغ أو null
  trip: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow("", null)
    .messages({
      "string.pattern.base": "trip must only contain hexadecimal characters",
    }),
  rating: Joi.number().min(1).max(5).required().messages({
    "number.min": "Rating must be at least 1",
    "number.max": "Rating cannot exceed 5",
  }),
  comment: Joi.string().min(3).required().messages({
    "string.empty": "Comment cannot be empty",
  }),
  userName: Joi.string().optional().allow("", null),
  media: Joi.any().optional(),
});

module.exports = { createReviewValidation };