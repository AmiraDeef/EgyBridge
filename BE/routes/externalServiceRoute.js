const express = require("express");
const router = express.Router();
const {
  createExternalService,
  getAllExternalServices,
  getExternalServiceById,
  updateExternalService,
  deleteExternalService,
} = require("../controllers/externalService.controller");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { restrictTo } = require("../middlewares/restrictTo");

router.get("/", getAllExternalServices);
router.get("/:id", getExternalServiceById);

router.post("/", authMiddleware, restrictTo("admin"), createExternalService);
router.put("/:id", authMiddleware, restrictTo("admin"), updateExternalService);
router.delete("/:id", authMiddleware, restrictTo("admin"), deleteExternalService);

module.exports = router;
