const Tour = require("../models/Trip.js");
const Booking = require("../models/Booking.js");
const { createBookingValidation } = require("./validations/bookingValidation.js");

const createBooking = async (req, res, next) => {
  try {
    const { error, value } = createBookingValidation.validate(req.body);

    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // Check if trip exists
    const trip = await Tour.findById(value.trip);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Calculate total price automatically based on trip price & seats
    const totalPrice = (trip.price || 100) * value.seats;

    const booking = await Booking.create({
      user: req.userId, // Assume populated from Auth middleware (req.user)
      trip: value.trip,
      seats: value.seats,
      totalPrice,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (err) {
    next(err);
  }
};

const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate("trip", "title price location image")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (err) {
    next(err);
  }
};
module.exports = { createBooking, getUserBookings, cancelBooking };