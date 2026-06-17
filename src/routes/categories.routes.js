/**
 * @fileoverview Rutas CRUD para la entidad Category.
 * Endpoints para obtener, crear, actualizar y eliminar categorías.
 */

import { Router } from "express";
import { prisma } from "../db.js";
import AppError from "../utils/AppError.js";

/**
 * Router de Express para rutas de categorías.
 * @type {import('express').Router}
 */
const router = Router();

/**
 * GET /categories
 * Obtiene todas las categorías con sus libros asociados.
 */
router.get("/categories", async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        books: true,
      },
    });

    res.json(categories);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /categories/:id
 * Obtiene una categoría específica por ID.
 */
router.get("/categories/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return next(new AppError("ID inválido", 400));
    }

    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        books: true,
      },
    });

    if (!category) {
      return next(
        new AppError(`Categoría con id ${id} no existe`, 404)
      );
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /categories
 * Crea una nueva categoría.
 */
router.post("/categories", async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return next(
        new AppError("El nombre de la categoría es obligatorio", 400)
      );
    }

    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
      },
    });

    if (existingCategory) {
      return next(
        new AppError(`La categoría ${name} ya existe`, 400)
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    res.json(category);
  } catch (error) {
    if (error?.code === "P2002") {
      return next(
        new AppError(`La categoría ${req.body?.name} ya existe`, 400)
      );
    }

    next(error);
  }
});

/**
 * PATCH /categories/:id
 * Actualiza parcialmente una categoría existente.
 */
router.patch("/categories/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (isNaN(Number(id))) {
      return next(new AppError("ID inválido", 400));
    }

    const existingCategory = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingCategory) {
      return next(
        new AppError(`Categoría con id ${id} no existe`, 404)
      );
    }

    if (name !== undefined) {
      if (name.trim() === "") {
        return next(
          new AppError("El nombre de la categoría es obligatorio", 400)
        );
      }

      const duplicateCategory = await prisma.category.findFirst({
        where: {
          name,
        },
      });

      if (
        duplicateCategory &&
        duplicateCategory.id !== Number(id)
      ) {
        return next(
          new AppError(`La categoría ${name} ya existe`, 400)
        );
      }
    }

    const category = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
      },
    });

    res.json(category);
  } catch (error) {
    if (error?.code === "P2002") {
      return next(
        new AppError(`La categoría ${req.body?.name} ya existe`, 400)
      );
    }

    next(error);
  }
});

/**
 * DELETE /categories/:id
 * Elimina una categoría por su ID.
 */
router.delete("/categories/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return next(new AppError("ID inválido", 400));
    }

    const existingCategory = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingCategory) {
      return next(
        new AppError(`Categoría con id ${id} no existe`, 404)
      );
    }

    const category = await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });

    res.json(category);
  } catch (error) {
    next(error);
  }
});

export default router;