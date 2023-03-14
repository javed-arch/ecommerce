import express from "express";
import { verifyAdmin } from "../middleware/authMiddleware.js";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", verifyAdmin, createCategory);

router.get("/", getCategories);

router.get("/:id", getCategoryById);

router.put("/:id", verifyAdmin, updateCategory);

router.delete("/:id", verifyAdmin, deleteCategory);

export default router;
