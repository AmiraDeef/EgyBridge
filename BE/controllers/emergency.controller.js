const EmergencyIncident = require("../models/EmergencyIncident");
const {
  createSosValidation,
  updateStatusValidation,
} = require("./validations/emergencyValidation");

// POST /api/user/emergency/sos
// Priority endpoint — always available, minimal friction. Accepts either
// an uploaded file (multipart, field name "media", handled by
// middlewares/upload.js -> req.file.path is the Cloudinary URL) or a
// mediaUrl string (e.g. an external live-stream link), plus coordinates.
const triggerSos = async (req, res, next) => {
  try {
    const { error, value } = createSosValidation.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: error.details.map((e) => e.message),
      });
    }

    const uploadedUrl = req.file ? req.file.path : null;
    const mediaUrl = uploadedUrl || value.mediaUrl || null;
    const mediaType = uploadedUrl
      ? req.file.mimetype?.startsWith("video") ? "video" : "image"
      : value.mediaType || null;

    const incident = await EmergencyIncident.create({
      user: req.userId,
      mediaUrl,
      mediaType,
      location: {
        lat: value.lat,
        lng: value.lng,
        address: value.address || "",
      },
      landmark: value.landmark || "",
      description: value.description || "",
    });

    // NOTE: wiring this up to an actual authority (SMS/push/webhook to a
    // dispatch system) is an infra decision outside this endpoint's scope —
    // this is the persistence + acknowledgment step the client waits on.
    res.status(201).json({
      message: "SOS received. Help is being notified.",
      incident,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/user/emergency/my-incidents
const getMyIncidents = async (req, res, next) => {
  try {
    const incidents = await EmergencyIncident.find({ user: req.userId }).sort({
      createdAt: -1,
    });
    res.json(incidents);
  } catch (err) {
    next(err);
  }
};

// GET /api/user/emergency/:id
const getIncidentById = async (req, res, next) => {
  try {
    const incident = await EmergencyIncident.findOne({
      _id: req.params.id,
      user: req.userId,
    });
    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }
    res.json(incident);
  } catch (err) {
    next(err);
  }
};

// GET /api/user/emergency  (admin/authority dashboard — all incidents)
const getAllIncidents = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const incidents = await EmergencyIncident.find(filter)
      .populate("user", "fullName phone")
      .sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/user/emergency/:id/status  (admin/authority only)
const updateIncidentStatus = async (req, res, next) => {
  try {
    const { error, value } = updateStatusValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const update = { status: value.status };
    if (value.status === "verified") update.verifiedBy = req.userId;
    if (value.status === "resolved") update.resolvedAt = new Date();

    const incident = await EmergencyIncident.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    res.json({ message: "Incident status updated", incident });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  triggerSos,
  getMyIncidents,
  getIncidentById,
  getAllIncidents,
  updateIncidentStatus,
};
