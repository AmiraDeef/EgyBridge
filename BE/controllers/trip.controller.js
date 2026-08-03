const Tour =require("../models/Trip.js");
const {
  createTourValidation,
  updateTourValidation,
} =require("./validations/tripValidation.js");

const createTour = async (req, res, next) => {
  try {
    const { error, value } = createTourValidation.validate(req.body);

    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const tour = await Tour.create(value);

    res.status(201).json({
      message: "Tour created successfully",
      tour,
    });
  } catch (err) {
    next(err);
  }
};

const getAllTours = async (req, res, next) => {
  try {
    const tours = await Tour.find().sort({ createdAt: -1 });

    res.json(tours);
  } catch (err) {
    next(err);
  }
};

const getTourById = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour)
      return res.status(404).json({
        message: "Tour not found",
      });

    res.json(tour);
  } catch (err) {
    next(err);
  }
};

const updateTour = async (req, res, next) => {
  try {
    const { error, value } = updateTourValidation.validate(req.body);

    if (error)
      return res.status(400).json({
        message: error.details[0].message,
      });

    const tour = await Tour.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });

    if (!tour)
      return res.status(404).json({
        message: "Tour not found",
      });

    res.json({
      message: "Tour updated successfully",
      tour,
    });
  } catch (err) {
    next(err);
  }
};

const deleteTour = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour)
      return res.status(404).json({
        message: "Tour not found",
      });

    res.json({
      message: "Tour deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
};