import { Router } from "express";
import validateFields from "../middleware/validateFields.js";

import {
  createBookValidators,
  updateBookValidators,
  validateBookId,
} from "../validators/book.validators.js";

import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/book.controller.js";

const router = Router();

// Obtener todos los libros
router.get("/books", getBooks);

// Obtener un libro por ID
router.get(
  "/books/:id",
  validateBookId,
  validateFields,
  getBookById
);

// Crear libro
router.post(
  "/books",
  createBookValidators,
  validateFields,
  createBook
);

// Actualizar libro
router.patch(
  "/books/:id",
  updateBookValidators,
  validateFields,
  updateBook
);

// Eliminar libro
router.delete(
  "/books/:id",
  validateBookId,
  validateFields,
  deleteBook
);

export default router;