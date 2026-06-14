import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

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