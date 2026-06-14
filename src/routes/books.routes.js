import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

router.get("/books", async (req, res, next) => {
  try {
    const books = await prisma.book.findMany({
      include: {
        category: true,
      },
    });

    res.json(books);
  } catch (error) {
    next(error);
  }
});

router.post("/books", async (req, res, next) => {
  try {
    const { title, author, publishedYear, price, categorId } = req.body;   

    const book = await prisma.book.create({
      data: {
        title,
        author,
        publishedYear,
        price,
        categorId,
      },
    });

    res.json(book);
  } catch (error) {
    next(error);
  }
});

router.put("/books/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, author, publishedYear, price, categorId } = req.body;

    const book = await prisma.book.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        author,
        publishedYear,
        price: Number(price),
        categorId: Number(categorId),
      },
    });

    res.json(book);
  } catch (error) {
    next(error);
  }
});

router.delete("/books/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.delete({
      where: {
        id: Number(id),
      },
    });

    res.json(book);
  } catch (error) {
    next(error);
  }
});

export default router;