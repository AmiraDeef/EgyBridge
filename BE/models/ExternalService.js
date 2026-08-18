const mongoose = require("mongoose");

// IA Section 5 "Official Services" — visa portals, transport bookers,
// accommodation platforms, activity/tour operators, etc. This is
// deliberately separate from Place: a Place is somewhere you go, an
// ExternalService is a link you click to arrange something official.
const externalServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["visa", "transport", "accommodation", "activities", "other"],
      required: true,
    },

    officialLink: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    // True only once the team has manually confirmed this is the real,
    // official source — surfaced in the UI as a "Verified" badge.
    isVerified: {
      type: Boolean,
      default: false,
    },

    relatedPlace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      default: null,
    },
  },
  { timestamps: true }
);

externalServiceSchema.index({ category: 1, isVerified: 1 });

const ExternalService = mongoose.model("ExternalService", externalServiceSchema);
module.exports = ExternalService;
