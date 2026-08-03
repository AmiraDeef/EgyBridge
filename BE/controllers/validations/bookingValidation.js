const Joi = require("joi");

const createBookingValidation = Joi.object({
  trip: Joi.string().hex().length(24).required().messages({
    "string.empty": "Trip ID is required",
    "string.length": "Invalid Trip ID format",
  }),
  seats: Joi.number().integer().min(1).required().messages({
    "number.min": "At least 1 seat must be booked",
  }),
});

module.exports = { createBookingValidation };