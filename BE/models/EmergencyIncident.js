const mongoose = require("mongoose");

const emergencyIncidentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Uploaded via multer/Cloudinary (middlewares/upload.js) — a recorded
    // clip or, if the client streams elsewhere (e.g. a live-stream service),
    // the URL to that stream/recording.
    mediaUrl: {
      type: String,
      default: null,
    },
    mediaType: {
      type: String,
      enum: ["image", "video", "live_stream_link", null],
      default: null,
    },

    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, trim: true, default: "" },
    },

    landmark: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "verified", "resolved"],
      default: "pending",
    },

    // Set once an authority/dispatcher picks it up — useful for the
    // "Send to Verified Emergency Authority" step in the SOS flow.
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Fast lookups for "active incidents" dashboards / authority views
emergencyIncidentSchema.index({ status: 1, createdAt: -1 });

const EmergencyIncident = mongoose.model("EmergencyIncident", emergencyIncidentSchema);
module.exports = EmergencyIncident;
