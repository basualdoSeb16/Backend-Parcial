import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categories.controller.js";

const router = Router();

router.get("/categories", verifyToken, getCategories);

router.get("/categories/:id", verifyToken, getCategoryById);

router.post("/categories", verifyToken, authorizeRoles("ADMIN", "SUPERADMIN"), createCategory);

router.patch("/categories/:id", verifyToken, authorizeRoles("ADMIN", "SUPERADMIN"), updateCategory);

router.delete("/categories/:id", verifyToken, authorizeRoles("ADMIN", "SUPERADMIN"), deleteCategory);

export default router;
