import { Router } from "express";
import { prisma } from "../db.js";
import AppError from "../utils/AppError.js";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRoles.js";

const router = Router();

// ─────────────────────────────────────────────
// GET /api/categories
// Cualquier usuario autenticado puede ver las categorías
// ─────────────────────────────────────────────
router.get("/categories", verifyToken, async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { books: true },
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────
// GET /api/categories/:id
// Cualquier usuario autenticado puede ver una categoría
// ─────────────────────────────────────────────
router.get("/categories/:id", verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return next(new AppError("ID inválido", 400));
    }

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      include: { books: true },
    });

    if (!category) {
      return next(new AppError(`Categoría con id ${id} no existe`, 404));
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────
// POST /api/categories
// Solo ADMIN y SUPERADMIN pueden crear categorías
// ─────────────────────────────────────────────
router.post(
  "/categories",
  verifyToken,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  async (req, res, next) => {
    try {
      const { name } = req.body;

      if (!name || name.trim() === "") {
        return next(new AppError("El nombre de la categoría es obligatorio", 400));
      }

      const existingCategory = await prisma.category.findFirst({ where: { name } });
      if (existingCategory) {
        return next(new AppError(`La categoría ${name} ya existe`, 400));
      }

      const category = await prisma.category.create({ data: { name } });

      res.json(category);
    } catch (error) {
      if (error?.code === "P2002") {
        return next(new AppError(`La categoría ${req.body?.name} ya existe`, 400));
      }
      next(error);
    }
  }
);

// ─────────────────────────────────────────────
// PATCH /api/categories/:id
// Solo ADMIN y SUPERADMIN pueden actualizar categorías
// ─────────────────────────────────────────────
router.patch(
  "/categories/:id",
  verifyToken,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (isNaN(Number(id))) {
        return next(new AppError("ID inválido", 400));
      }

      const existingCategory = await prisma.category.findUnique({
        where: { id: Number(id) },
      });

      if (!existingCategory) {
        return next(new AppError(`Categoría con id ${id} no existe`, 404));
      }

      if (name !== undefined) {
        if (name.trim() === "") {
          return next(new AppError("El nombre de la categoría es obligatorio", 400));
        }

        const duplicateCategory = await prisma.category.findFirst({ where: { name } });
        if (duplicateCategory && duplicateCategory.id !== Number(id)) {
          return next(new AppError(`La categoría ${name} ya existe`, 400));
        }
      }

      const category = await prisma.category.update({
        where: { id: Number(id) },
        data: { name },
      });

      res.json(category);
    } catch (error) {
      if (error?.code === "P2002") {
        return next(new AppError(`La categoría ${req.body?.name} ya existe`, 400));
      }
      next(error);
    }
  }
);

// ─────────────────────────────────────────────
// DELETE /api/categories/:id
// Solo ADMIN y SUPERADMIN pueden eliminar categorías
// ─────────────────────────────────────────────
router.delete(
  "/categories/:id",
  verifyToken,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      if (isNaN(Number(id))) {
        return next(new AppError("ID inválido", 400));
      }

      const existingCategory = await prisma.category.findUnique({
        where: { id: Number(id) },
      });

      if (!existingCategory) {
        return next(new AppError(`Categoría con id ${id} no existe`, 404));
      }

      const category = await prisma.category.delete({
        where: { id: Number(id) },
      });

      res.json(category);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
