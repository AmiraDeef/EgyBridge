const Place = require("../models/Place");
const {
  createPlaceValidation,
  updatePlaceValidation,
} = require("./validations/placeValidation");

// POST /api/user/places  (admin only)
const createPlace = async (req, res, next) => {
  try {
    const { error, value } = createPlaceValidation.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: error.details.map((e) => e.message),
      });
    }

    const place = await Place.create(value);
    res.status(201).json({ message: "Place created successfully", place });
  } catch (err) {
    next(err);
  }
};

// GET /api/user/places?category=restaurant
const getAllPlaces = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const places = await Place.find(filter).sort({ createdAt: -1 });
    res.json(places);
  } catch (err) {
    next(err);
  }
};

// GET /api/user/places/:id
const getPlaceById = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });
    res.json(place);
  } catch (err) {
    next(err);
  }
};

// GET /api/user/places/:id/context
// IA Section 4 dedicated endpoint — returns just the contextual fields the
// "Place & Situation Context" screens need, so the client doesn't have to
// pull (and cache) the full Place document.
const getPlaceContext = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id).select(
      "name category culturalTips transportOptions priceContext practicalInfo"
    );

    if (!place) return res.status(404).json({ message: "Place not found" });

    res.json(place);
  } catch (err) {
    next(err);
  }
};

// PUT /api/user/places/:id  (admin only)
const updatePlace = async (req, res, next) => {
  try {
    const { error, value } = updatePlaceValidation.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: error.details.map((e) => e.message),
      });
    }

    const place = await Place.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });

    if (!place) return res.status(404).json({ message: "Place not found" });

    res.json({ message: "Place updated successfully", place });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/user/places/:id  (admin only)
const deletePlace = async (req, res, next) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });
    res.json({ message: "Place deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPlace,
  getAllPlaces,
  getPlaceById,
  getPlaceContext,
  updatePlace,
  deletePlace,
};
