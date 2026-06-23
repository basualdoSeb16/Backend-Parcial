import { prisma } from "../db.js";
import {
  categoryNotFound,
  invalidPriceOrQuantity,
  bookAlreadyExists,
} from "../utils/bookErrors.js";

// ─────────────────────────────────────────────
// GET /api/books
// ─────────────────────────────────────────────
export const getBooks = async (req, res, next) => {
  try {
    const books = await prisma.book.findMany({
      include: { category: true },
    });
    res.json(books);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// GET /api/books/:id
// ─────────────────────────────────────────────
export const getBookById = async (req, res, next) => {
  try {
    const book = await prisma.book.findUnique({
      where: { id: Number(req.params.id) },
      include: { category: true },
    });

    res.json(book);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// POST /api/books
// ─────────────────────────────────────────────
export const createBook = async (req, res, next) => {
  try {
    const { title, price, quantity, categorId } = req.body;

    if (price == null || Number(price) <= 0) {
      return next(invalidPriceOrQuantity("El precio debe ser un número decimal positivo"));
    }

    if (quantity == null || Number(quantity) < 0) {
      return next(invalidPriceOrQuantity("La cantidad debe ser un número entero no negativo"));
    }

    const category = await prisma.category.findUnique({
      where: { id: Number(categorId) },
    });

    if (!category) {
      return next(categoryNotFound(categorId));
    }

    const existingBook = await prisma.book.findUnique({ where: { title } });
    if (existingBook) {
      return next(bookAlreadyExists(title));
    }

    const book = await prisma.book.create({ data: req.body });

    res.json(book);
  } catch (error) {
    if (error?.code === "P2002") {
      return next(bookAlreadyExists(req.body?.title || ""));
    }
    next(error);
  }
};

// ─────────────────────────────────────────────
// PATCH /api/books/:id
// ─────────────────────────────────────────────
export const updateBook = async (req, res, next) => {
  try {
    const { title, price, quantity, categorId } = req.body;

    if (price != null && Number(price) <= 0) {
      return next(invalidPriceOrQuantity("El precio debe ser un número decimal positivo"));
    }

    if (quantity != null && Number(quantity) < 0) {
      return next(invalidPriceOrQuantity("La cantidad debe ser un número entero no negativo"));
    }

    if (categorId != null) {
      const category = await prisma.category.findUnique({
        where: { id: Number(categorId) },
      });
      if (!category) {
        return next(categoryNotFound(categorId));
      }
    }

    if (title) {
      const existingBook = await prisma.book.findUnique({ where: { title } });
      if (existingBook && existingBook.id !== Number(req.params.id)) {
        return next(bookAlreadyExists(title));
      }
    }

    const book = await prisma.book.update({
      where: { id: Number(req.params.id) },
      data: req.body,
      include: { category: true },
    });

    res.json(book);
  } catch (error) {
    if (error?.code === "P2002") {
      return next(bookAlreadyExists(req.body?.title || ""));
    }
    next(error);
  }
};

// ─────────────────────────────────────────────
// DELETE /api/books/:id
// ─────────────────────────────────────────────
export const deleteBook = async (req, res, next) => {
  try {
    const book = await prisma.book.delete({
      where: { id: Number(req.params.id) },
    });

    res.json(book.quantity);
  } catch (error) {
    next(error);
  }
};
