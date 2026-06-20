import { Router } from "express";
import validateFields from "../middleware/validateFields.js";

import AppError from "../utils/AppError.js";

import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categories.controller.js";

const router = Router();

// Obtener todas las categorías
router.get("/categories", getCategories);

// Obtener categoría por ID
router.get(
  "/categories/:id",
  validateFields,
  getCategoryById
);

// Crear categoría
router.post(
  "/categories",
  validateFields,
  createCategory
);

// Actualizar categoría
router.patch(
  "/categories/:id",
  validateFields,
  updateCategory
);

// Eliminar categoría
router.delete(
  "/categories/:id",
  validateFields,
  deleteCategory
);

export default router;