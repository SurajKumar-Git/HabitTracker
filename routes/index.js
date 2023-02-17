import express from "express";
import { home, weekView } from "../controllers/homeController.js";
import habitRouter from "./habit.js";
import categoryRouter from "./category.js";

const router = express.Router();

router.get("/", home);
router.get("/weekview", weekView);
router.use("/habit", habitRouter);
router.use("/category", categoryRouter);

export default router;
