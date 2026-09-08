const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },
    itinerary: [
    {
      dayNumber: Number,
      title: String,
      description: String,
      activities: [
        {
          time: String,
          title: String,
          description: String
        }
      ]
    }
  ]
  },
  {
    timestamps: true,
  }
);

const Trip=mongoose.model("Trip",tripSchema);

module.exports=Trip;