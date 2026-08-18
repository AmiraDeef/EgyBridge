const express = require("express");
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  cancelBooking,
} = require("../controllers/booking.controller");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createBooking);
router.get("/", authMiddleware, getUserBookings);
router.patch("/:id/cancel", authMiddleware, cancelBooking);

module.exports = router;
