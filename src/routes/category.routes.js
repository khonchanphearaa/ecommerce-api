import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from "../controllers/category.controller.js";

const router = express.Router();

// Public
router.get("/", getCategories);

// Public route: get category by ID
router.get("/:id", getCategoryById);

// Admin Protected
router.post("/", protect, createCategory);
router.put("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);

export default router;
