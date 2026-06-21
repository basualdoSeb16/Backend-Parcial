import { Router } from "express";
import { prisma } from "../db.js";
import validateFields from "../middleware/validateFields.js";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import {
  categoryNotFound,
  invalidPriceOrQuantity,
  bookAlreadyExists,
} from "../utils/bookErrors.js";
import {
  createBookValidators,
  updateBookValidators,
  validateBookId,
} from "../validators/book.validators.js";

const router = Router();

// ─────────────────────────────────────────────
// GET /api/books
// Cualquier usuario autenticado puede ver los libros
// ─────────────────────────────────────────────
router.get("/books", verifyToken, async (req, res, next) => {
  try {
    const books = await prisma.book.findMany({
      include: { category: true },
    });
    res.json(books);
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────
// GET /api/books/:id
// Cualquier usuario autenticado puede ver un libro
// ─────────────────────────────────────────────
router.get(
  "/books/:id",
  verifyToken,
  validateBookId,
  validateFields,
  async (req, res, next) => {
    try {
      const book = await prisma.book.findUnique({
        where: { id: Number(req.params.id) },
        include: { category: true },
      });

      res.json(book);
    } catch (error) {
      next(error);
    }
  }
);

// ─────────────────────────────────────────────
// POST /api/books
// Solo ADMIN y SUPERADMIN pueden crear libros
// ─────────────────────────────────────────────
router.post(
  "/books",
  verifyToken,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  createBookValidators,
  validateFields,
  async (req, res, next) => {
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
  }
);

// ─────────────────────────────────────────────
// PATCH /api/books/:id
// Solo ADMIN y SUPERADMIN pueden actualizar libros
// ─────────────────────────────────────────────
router.patch(
  "/books/:id",
  verifyToken,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  updateBookValidators,
  validateFields,
  async (req, res, next) => {
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
  }
);

// ─────────────────────────────────────────────
// DELETE /api/books/:id
// Solo ADMIN y SUPERADMIN pueden eliminar libros
// ─────────────────────────────────────────────
router.delete(
  "/books/:id",
  verifyToken,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  validateBookId,
  validateFields,
  async (req, res, next) => {
    try {
      const book = await prisma.book.delete({
        where: { id: Number(req.params.id) },
      });

      res.json(book.quantity);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
