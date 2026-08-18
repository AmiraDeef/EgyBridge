const mongoose = require("mongoose");

// NOTE: this is deliberately a separate model from models/Trip.js.
// Trip.js is a sellable *Tour package* (title/price/location/image) used by
// Booking + Review. TripPlan.js is the user's own personal itinerary built
// during onboarding (Flow A/B: budget, duration, interests, destinations,
// day-by-day plan) — a different shape and a different owner (always the
// current user, never an admin-created catalog item).

const activitySchema = new mongoose.Schema(
  {
    time: { type: String, trim: true }, // e.g. "09:00" — free text, kept simple for v1
    title: { type: String, required: true, trim: true },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      default: null,
    },
    notes: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const dayPlanSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true, min: 1 },
    date: { type: Date },
    activities: { type: [activitySchema], default: [] },
  },
  { _id: false }
);

const tripPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      trim: true,
      default: "My Egypt Trip",
    },

    budget: {
      type: Number,
      required: true,
      min: 0,
    },

    duration: {
      type: Number, // number of days
      required: true,
      min: 1,
      max: 60,
    },

    interests: {
      type: [String],
      default: [],
      // e.g. "history", "diving", "nightlife", "food", "nature"
    },

    destinations: {
      type: [String],
      default: [],
      // e.g. "Cairo", "Luxor", "Aswan", "Hurghada"
    },

    itinerary: {
      type: [dayPlanSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["draft", "generated", "confirmed"],
      default: "draft",
    },
  },
  { timestamps: true }
);

const TripPlan = mongoose.model("TripPlan", tripPlanSchema);
module.exports = TripPlan;
