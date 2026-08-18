const Joi = require("joi");

const transportOptionSchema = Joi.object({
  type: Joi.string().trim().required(),
  estimatedCost: Joi.number().min(0),
  notes: Joi.string().trim().allow(""),
});

const createPlaceValidation = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  category: Joi.string()
    .valid("attraction", "restaurant", "cafe", "accommodation", "hidden_gem", "activity")
    .required(),
  description: Joi.string().trim().allow("").max(2000),
  location: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
    address: Joi.string().trim().allow(""),
  }).required(),
  images: Joi.array().items(Joi.string().uri()).default([]),
  culturalTips: Joi.object({
    dos: Joi.array().items(Joi.string().trim()).default([]),
    donts: Joi.array().items(Joi.string().trim()).default([]),
  }),
  transportOptions: Joi.array().items(transportOptionSchema).default([]),
  priceContext: Joi.object({
    range: Joi.string().trim().allow(""),
    budgetTips: Joi.array().items(Joi.string().trim()).default([]),
  }),
  practicalInfo: Joi.object({
    openingHours: Joi.string().trim().allow(""),
    bestTimeToVisit: Joi.string().trim().allow(""),
    estimatedVisitDuration: Joi.string().trim().allow(""),
  }),
  isFeatured: Joi.boolean(),
});

const updatePlaceValidation = createPlaceValidation.fork(
  ["name", "category", "location"],
  (schema) => schema.optional()
).min(1);

module.exports = { createPlaceValidation, updatePlaceValidation };
