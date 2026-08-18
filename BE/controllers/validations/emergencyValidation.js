const Joi = require("joi");

// multipart/form-data: the file itself is handled by multer (req.file);
// everything else arrives as string fields in req.body, so lat/lng come in
// as strings — Joi.number() still coerces them fine.
const createSosValidation = Joi.object({
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
  address: Joi.string().trim().allow("").max(200),
  landmark: Joi.string().trim().allow("").max(200),
  description: Joi.string().trim().allow("").max(1000),
  mediaType: Joi.string().valid("image", "video", "live_stream_link"),
  // Only used when the client sends a link instead of uploading a file
  // (e.g. an external live-stream URL).
  mediaUrl: Joi.string().uri().optional(),
});

const updateStatusValidation = Joi.object({
  status: Joi.string().valid("pending", "verified", "resolved").required(),
});

module.exports = { createSosValidation, updateStatusValidation };
