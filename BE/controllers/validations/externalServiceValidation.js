const Joi = require("joi");

const createExternalServiceValidation = Joi.object({
  name: Joi.string().trim().min(2).max(150).required(),
  category: Joi.string()
    .valid("visa", "transport", "accommodation", "activities", "other")
    .required(),
  officialLink: Joi.string().uri().required(),
  description: Joi.string().trim().allow("").max(1000),
  isVerified: Joi.boolean(),
  relatedPlace: Joi.string().hex().length(24).allow(null),
});

const updateExternalServiceValidation = createExternalServiceValidation
  .fork(["name", "category", "officialLink"], (schema) => schema.optional())
  .min(1);

module.exports = { createExternalServiceValidation, updateExternalServiceValidation };
