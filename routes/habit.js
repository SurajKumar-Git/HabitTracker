import express from "express";
import {
  addHabit,
  deleteHabit,
  trackHabit,
  unTrackHabit,
  getHabitsStatusForWeek,
} from "../controllers/habitController.js";
const router = express.Router();

router.post("/add", addHabit);
router.get("/delete/:id", deleteHabit);
router.post("/trackhabit", trackHabit);
router.post("/untrackhabit", unTrackHabit);
router.get("/week-status", getHabitsStatusForWeek);

export default router;
