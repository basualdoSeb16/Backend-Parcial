import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

// GET /books - Traer todos los libros con su categoría
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


// GET /books/:id - Traer un libro por su ID con su categoría
router.get("/books/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        category: true,
      },
    });

    if (!book) {
      return res.status(404).json({
        message: "Libro no encontrado",
      });
    }

    res.json(book);
  } catch (error) {
    next(error);
  }
});

// POST /books - Crear un nuevo libro
router.post("/books", async (req, res, next) => {
  try {
    const { title, author, publishedYear, price, categoryId } = req.body;   

    const book = await prisma.book.create({
      data: {
        title,
        author,
        publishedYear,
        price,
        categoryId,
      },
    });

    res.json(book);
  } catch (error) {
    next(error);
  }
});

// PUT /books/:id - Actualizar un libro por su ID
router.put("/books/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, author, publishedYear, price, categoryId } = req.body;

    const book = await prisma.book.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        author,
        publishedYear,
        price: Number(price),
        categoryId: Number(categoryId),
      },
    });

    res.json(book);
  } catch (error) {
    next(error);
  }
});

// DELETE /books/:id - Eliminar un libro por su ID
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