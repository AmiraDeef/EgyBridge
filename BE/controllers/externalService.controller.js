const ExternalService = require("../models/ExternalService");
const {
  createExternalServiceValidation,
  updateExternalServiceValidation,
} = require("./validations/externalServiceValidation");

// POST /api/user/services  (admin only)
const createExternalService = async (req, res, next) => {
  try {
    const { error, value } = createExternalServiceValidation.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: error.details.map((e) => e.message),
      });
    }

    const service = await ExternalService.create(value);
    res.status(201).json({ message: "Service added successfully", service });
  } catch (err) {
    next(err);
  }
};

// GET /api/user/services?category=visa&verifiedOnly=true
const getAllExternalServices = async (req, res, next) => {
  try {
    const { category, verifiedOnly } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (verifiedOnly === "true") filter.isVerified = true;

    const services = await ExternalService.find(filter).sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    next(err);
  }
};

// GET /api/user/services/:id
const getExternalServiceById = async (req, res, next) => {
  try {
    const service = await ExternalService.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    next(err);
  }
};

// PUT /api/user/services/:id  (admin only)
const updateExternalService = async (req, res, next) => {
  try {
    const { error, value } = updateExternalServiceValidation.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: error.details.map((e) => e.message),
      });
    }

    const service = await ExternalService.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });

    if (!service) return res.status(404).json({ message: "Service not found" });

    res.json({ message: "Service updated successfully", service });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/user/services/:id  (admin only)
const deleteExternalService = async (req, res, next) => {
  try {
    const service = await ExternalService.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createExternalService,
  getAllExternalServices,
  getExternalServiceById,
  updateExternalService,
  deleteExternalService,
};
