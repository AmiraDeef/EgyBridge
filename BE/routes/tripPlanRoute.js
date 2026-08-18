const express = require("express");
const router = express.Router();
const {
  generateTripPlan,
  getMyTrip,
  getMyTripPlans,
  getTripPlanById,
  updateItinerary,
  deleteTripPlan,
  getOfflinePack,
} = require("../controllers/tripPlan.controller");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Order matters: specific paths ("/generate", "/my-trip") must come before
// the "/:id" catch-all routes below.
router.post("/generate", authMiddleware, generateTripPlan);
router.get("/my-trip", authMiddleware, getMyTrip);
router.get("/", authMiddleware, getMyTripPlans);

router.get("/:id", authMiddleware, getTripPlanById);
router.get("/:id/offline-pack", authMiddleware, getOfflinePack);
router.patch("/:id/itinerary", authMiddleware, updateItinerary);
router.delete("/:id", authMiddleware, deleteTripPlan);

module.exports = router;
