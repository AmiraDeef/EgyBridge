const express = require("express");
const router = express.Router();
const {
  triggerSos,
  getMyIncidents,
  getIncidentById,
  getAllIncidents,
  updateIncidentStatus,
} = require("../controllers/emergency.controller");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { restrictTo } = require("../middlewares/restrictTo");
const { uploadEmergencyMedia } = require("../middlewares/upload");

// Priority: SOS trigger. authMiddleware still required (we need req.userId
// to attribute the incident) — keep the user's session warm/logged-in as a
// product requirement so this endpoint is one tap, no extra typing.
router.post("/sos", authMiddleware, uploadEmergencyMedia, triggerSos);

router.get("/my-incidents", authMiddleware, getMyIncidents);
router.get("/:id", authMiddleware, getIncidentById);

// Authority/dispatcher-facing endpoints
router.get("/", authMiddleware, restrictTo("admin"), getAllIncidents);
router.patch("/:id/status", authMiddleware, restrictTo("admin"), updateIncidentStatus);

module.exports = router;
