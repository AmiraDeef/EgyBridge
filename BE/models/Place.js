const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "attraction",
        "restaurant",
        "cafe",
        "accommodation",
        "hidden_gem",
        "activity",
      ],
      required: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, trim: true, default: "" },
    },

    images: {
      type: [String],
      default: [],
    },

    // IA Section 4 — "Place & Situation Context"
    culturalTips: {
      dos: { type: [String], default: [] },
      donts: { type: [String], default: [] },
    },

    transportOptions: [
      {
        type: {
          type: String,
          trim: true, // e.g. "taxi", "metro", "uber", "walking"
        },
        estimatedCost: { type: Number, min: 0 },
        notes: { type: String, trim: true, default: "" },
        _id: false,
      },
    ],

    priceContext: {
      range: { type: String, trim: true, default: "" }, // e.g. "$$ (200-400 EGP)"
      budgetTips: { type: [String], default: [] },
    },

    practicalInfo: {
      openingHours: { type: String, trim: true, default: "" },
      bestTimeToVisit: { type: String, trim: true, default: "" },
      estimatedVisitDuration: { type: String, trim: true, default: "" },
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

placeSchema.index({ category: 1 });

const Place = mongoose.model("Place", placeSchema);
module.exports = Place;
