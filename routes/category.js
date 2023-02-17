import express from "express";
import {
  home,
  addCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
const router = express.Router();

router.get("/", home);
router.post("/add", addCategory);
router.get("/delete/:id", deleteCategory);

export default router;
