const TripPlan = require("../models/TripPlan");
const {
  generateTripPlanValidation,
  updateItineraryValidation,
} = require("./validations/tripPlanValidation");

// Very simple placeholder scheduler: spreads the chosen destinations evenly
// across the trip's duration and drops one "explore" activity per day.
// Swap this out for a real recommendation/AI service later — the shape of
// the output (itinerary: [{ day, activities: [...] }]) is what matters to
// the frontend and to the offline-pack endpoint below.
function buildDraftItinerary(duration, destinations) {
  const days = [];
  for (let day = 1; day <= duration; day++) {
    const destination = destinations[(day - 1) % destinations.length];
    days.push({
      day,
      activities: [
        {
          title: `Explore ${destination}`,
          notes: "Auto-generated placeholder — customize this day.",
        },
      ],
    });
  }
  return days;
}

// POST /api/user/trip-plans/generate
const generateTripPlan = async (req, res, next) => {
  try {
    const { error, value } = generateTripPlanValidation.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: error.details.map((e) => e.message),
      });
    }

    const itinerary = buildDraftItinerary(value.duration, value.destinations);

    const tripPlan = await TripPlan.create({
      user: req.userId,
      title: value.title || `Trip to ${value.destinations[0]}`,
      budget: value.budget,
      duration: value.duration,
      interests: value.interests,
      destinations: value.destinations,
      itinerary,
      status: "generated",
    });

    res.status(201).json({
      message: "Trip plan generated successfully",
      tripPlan,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/user/trip-plans/my-trip
// Returns the user's most recently updated trip plan (their "active" trip).
const getMyTrip = async (req, res, next) => {
  try {
    const tripPlan = await TripPlan.findOne({ user: req.userId })
      .sort({ updatedAt: -1 })
      .populate("itinerary.activities.place", "name category location");

    if (!tripPlan) {
      return res.status(404).json({ message: "No trip plan found" });
    }

    res.json(tripPlan);
  } catch (err) {
    next(err);
  }
};

// GET /api/user/trip-plans  — list all of the user's trip plans
const getMyTripPlans = async (req, res, next) => {
  try {
    const tripPlans = await TripPlan.find({ user: req.userId }).sort({
      updatedAt: -1,
    });
    res.json(tripPlans);
  } catch (err) {
    next(err);
  }
};

// GET /api/user/trip-plans/:id
const getTripPlanById = async (req, res, next) => {
  try {
    const tripPlan = await TripPlan.findOne({
      _id: req.params.id,
      user: req.userId,
    }).populate("itinerary.activities.place", "name category location");

    if (!tripPlan) {
      return res.status(404).json({ message: "Trip plan not found" });
    }

    res.json(tripPlan);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/user/trip-plans/:id/itinerary — user edits the generated plan
const updateItinerary = async (req, res, next) => {
  try {
    const { error, value } = updateItineraryValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const tripPlan = await TripPlan.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { itinerary: value.itinerary, status: "confirmed" },
      { new: true, runValidators: true }
    );

    if (!tripPlan) {
      return res.status(404).json({ message: "Trip plan not found" });
    }

    res.json({ message: "Itinerary updated", tripPlan });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/user/trip-plans/:id
const deleteTripPlan = async (req, res, next) => {
  try {
    const tripPlan = await TripPlan.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!tripPlan) {
      return res.status(404).json({ message: "Trip plan not found" });
    }

    res.json({ message: "Trip plan deleted" });
  } catch (err) {
    next(err);
  }
};

// GET /api/user/trip-plans/:id/offline-pack
// A trimmed-down JSON bundle for offline caching (IA section 6): itinerary
// plus the minimal place info needed to render it without a network call.
const getOfflinePack = async (req, res, next) => {
  try {
    const tripPlan = await TripPlan.findOne({
      _id: req.params.id,
      user: req.userId,
    })
      .populate({
        path: "itinerary.activities.place",
        select: "name category location practicalInfo images",
      })
      .lean();

    if (!tripPlan) {
      return res.status(404).json({ message: "Trip plan not found" });
    }

    const offlinePack = {
      tripId: tripPlan._id,
      title: tripPlan.title,
      duration: tripPlan.duration,
      destinations: tripPlan.destinations,
      itinerary: tripPlan.itinerary,
      generatedAt: new Date().toISOString(),
    };

    res.json(offlinePack);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generateTripPlan,
  getMyTrip,
  getMyTripPlans,
  getTripPlanById,
  updateItinerary,
  deleteTripPlan,
  getOfflinePack,
};
