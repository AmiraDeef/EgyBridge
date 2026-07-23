const express = require("express");

const {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
}= require("../controllers/trip.controller");
const authMiddleware=require("../middlewares/authMiddleware")
const router = express.Router();

router.post("/", authMiddleware,createTour);

router.get("/", authMiddleware,getAllTours);

router.get("/:id", authMiddleware,getTourById);

router.put("/:id", authMiddleware,updateTour);

router.delete("/:id", authMiddleware,deleteTour);

export default router;