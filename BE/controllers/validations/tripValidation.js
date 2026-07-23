import Joi from "joi";

export const createTripSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required(),

  location: Joi.string().trim().min(2).max(100).required(),

  duration: Joi.string().trim().required(),

  price: Joi.number().min(0).required(),

  description: Joi.string().trim().min(10).required(),

  image: Joi.string().uri().required(),

  featured: Joi.boolean().optional(),
});

export const updateTripSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100),
  location: Joi.string().trim().min(2).max(100),
  duration: Joi.string().trim(),
  price: Joi.number().min(0),
  description: Joi.string().trim().min(10),
  image: Joi.string().uri(),
  featured: Joi.boolean(),
}).min(1);