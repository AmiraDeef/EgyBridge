const Joi = require("joi");

const activitySchema = Joi.object({
  time: Joi.string().trim().allow(""),
  title: Joi.string().trim().required(),
  place: Joi.string().hex().length(24).allow(null),
  notes: Joi.string().trim().allow(""),
});

const dayPlanSchema = Joi.object({
  day: Joi.number().integer().min(1).required(),
  date: Joi.date().optional(),
  activities: Joi.array().items(activitySchema).default([]),
});

const generateTripPlanValidation = Joi.object({
  title: Joi.string().trim().max(100),
  budget: Joi.number().min(0).required(),
  duration: Joi.number().integer().min(1).max(60).required(),
  interests: Joi.array().items(Joi.string().trim()).default([]),
  destinations: Joi.array().items(Joi.string().trim()).min(1).required(),
});

const updateItineraryValidation = Joi.object({
  itinerary: Joi.array().items(dayPlanSchema).required(),
});

module.exports = {
  generateTripPlanValidation,
  updateItineraryValidation,
};
