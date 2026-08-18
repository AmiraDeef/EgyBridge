const express = require("express");
const router = express.Router();
const {
  createPlace,
  getAllPlaces,
  getPlaceById,
  getPlaceContext,
  updatePlace,
  deletePlace,
} = require("../controllers/place.controller");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { restrictTo } = require("../middlewares/restrictTo");

// Public reads — browsing places/context shouldn't require login
router.get("/", getAllPlaces);
router.get("/:id", getPlaceById);
router.get("/:id/context", getPlaceContext);

// Admin-managed content
router.post("/", authMiddleware, restrictTo("admin"), createPlace);
router.put("/:id", authMiddleware, restrictTo("admin"), updatePlace);
router.delete("/:id", authMiddleware, restrictTo("admin"), deletePlace);

module.exports = router;
