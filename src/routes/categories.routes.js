import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

// GET /categories - Traer todas las categorías con sus libros
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

// GET /categories/:id - Traer una categoría por su ID con sus libros
router.get("/categories/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        books: true,
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "Categoría no encontrada",
      });
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
});

// POST /categories - Crear una nueva categoría
router.post("/categories", async (req, res, next) => {
  try {
    const { name } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    res.json(category);
  } catch (error) {
    next(error);
  }
});

// PUT /categories/:id - Actualizar una categoría por su ID
router.put("/categories/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
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
    next(error);
  }
});

// DELETE /categories/:id - Eliminar una categoría por su ID
router.delete("/categories/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

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