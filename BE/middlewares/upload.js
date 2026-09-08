const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Generic Cloudinary-backed uploader. `folder` and `resourceType` let each
// route decide where files land and whether they're images or video/raw
// (SOS incidents may attach a recorded clip, so we allow video).
const makeUploader = (folder, resourceType = "auto") =>
  multer({
    storage: new CloudinaryStorage({
      cloudinary,
      params: {
        folder: `egi-rise/${folder}`,
        resource_type: resourceType, // "image" | "video" | "auto"
        allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "mov", "webm"],
      },
    }),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB — covers short SOS clips
  });

// Single-file uploaders used across routes
const uploadEmergencyMedia = makeUploader("emergency", "auto").single("media");
const uploadPlaceImage = makeUploader("places", "image").single("image");
const uploadReviewMedia = makeUploader("reviews", "auto").single("media");
module.exports = { makeUploader, uploadEmergencyMedia, uploadPlaceImage, uploadReviewMedia };
