/**
 * @fileoverview Rutas CRUD para la entidad Book.
 * Endpoints para obtener, crear, actualizar y eliminar libros.
 */

import { Router } from "express";
import { prisma } from "../db.js";
import validateFields from "../middleware/validateFields.js";
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

/**
 * Router de Express para rutas de libros.
 * @type {import("express").Router}
 */
const router = Router();

/**
 * GET /books
 * Obtiene todos los libros con su categoría asociada.
 *
 * @async
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 * @returns {Promise<void>} Responde con un array JSON de libros.
 *
 * @example
 * GET /api/books
 * Response:
 * [
 *   {
 *     id: 1,
 *     title: "Mistborn",
 *     author: "Brandon Sanderson",
 *     publishedYear: 2006,
 *     price: 20000,
 *     quantity: 10,
 *     categorId: 1,
 *     category: {...}
 *   }
 * ]
 */
router.get("/books", async (req, res, next) => {
  try {
    // Obtiene todos los libros incluyendo su categoría.
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

/**
 * POST /books
 * Crea un nuevo libro.
 *
 * @async
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 * @returns {Promise<void>} Responde con el libro creado.
 *
 * @example
 * POST /api/books
 * Body:
 * {
 *   "title": "Mistborn",
 *   "author": "Brandon Sanderson",
 *   "publishedYear": 2006,
 *   "price": 20000,
 *   "quantity": 10,
 *   "categorId": 1
 * }
 */
router.post(
  "/books",
  createBookValidators,
  validateFields,
  async (req, res, next) => {
    try {
      const {
        title,
        price,
        quantity,
        categorId,
      } = req.body;

      // Validación manual de precio.
      if (price == null || Number(price) <= 0) {
        return next(
          invalidPriceOrQuantity(
            "El precio debe ser un número decimal positivo"
          )
        );
      }

      // Validación manual de cantidad.
      if (quantity == null || Number(quantity) < 0) {
        return next(
          invalidPriceOrQuantity(
            "La cantidad debe ser un número entero no negativo"
          )
        );
      }

      // Verifica que la categoría exista.
      const category = await prisma.category.findUnique({
        where: {
          id: Number(categorId),
        },
      });

      if (!category) {
        return next(categoryNotFound(categorId));
      }

      // Verifica que no exista otro libro con el mismo título.
      const existingBook = await prisma.book.findUnique({
        where: {
          title,
        },
      });

      if (existingBook) {
        return next(bookAlreadyExists(title));
      }

      // Crea el libro.
      const book = await prisma.book.create({
        data: req.body,
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

/**
 * GET /books/:id
 * Obtiene un libro por su ID.
 *
 * @async
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 * @returns {Promise<void>} Responde con el libro encontrado.
 *
 * @example
 * GET /api/books/1
 */
router.get(
  "/books/:id",
  validateBookId,
  validateFields,
  async (req, res, next) => {
    try {
      // Busca un libro específico por ID.
      const book = await prisma.book.findUnique({
        where: {
          id: Number(req.params.id),
        },
        include: {
          category: true,
        },
      });

      res.json(book);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /books/:id
 * Actualiza parcialmente un libro.
 *
 * @async
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 * @returns {Promise<void>} Responde con el libro actualizado.
 *
 * @example
 * PATCH /api/books/1
 * Body:
 * {
 *   "price": 25000,
 *   "quantity": 20
 * }
 */
router.patch(
  "/books/:id",
  updateBookValidators,
  validateFields,
  async (req, res, next) => {
    try {
      const {
        title,
        price,
        quantity,
        categorId,
      } = req.body;

      // Valida precio si fue enviado.
      if (price != null && Number(price) <= 0) {
        return next(
          invalidPriceOrQuantity(
            "El precio debe ser un número decimal positivo"
          )
        );
      }

      // Valida cantidad si fue enviada.
      if (quantity != null && Number(quantity) < 0) {
        return next(
          invalidPriceOrQuantity(
            "La cantidad debe ser un número entero no negativo"
          )
        );
      }

      // Verifica que la categoría exista.
      if (categorId != null) {
        const category = await prisma.category.findUnique({
          where: {
            id: Number(categorId),
          },
        });

        if (!category) {
          return next(categoryNotFound(categorId));
        }
      }

      // Verifica que el título no esté repetido.
      if (title) {
        const existingBook = await prisma.book.findUnique({
          where: {
            title,
          },
        });

        if (
          existingBook &&
          existingBook.id !== Number(req.params.id)
        ) {
          return next(bookAlreadyExists(title));
        }
      }

      // Actualiza el libro.
      const book = await prisma.book.update({
        where: {
          id: Number(req.params.id),
        },
        data: req.body,
        include: {
          category: true,
        },
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

/**
 * DELETE /books/:id
 * Elimina un libro por su ID.
 *
 * @async
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 * @returns {Promise<void>} Responde con la cantidad del libro eliminado.
 *
 * @example
 * DELETE /api/books/1
 */
router.delete(
  "/books/:id",
  validateBookId,
  validateFields,
  async (req, res, next) => {
    try {
      // Elimina el libro indicado.
      const book = await prisma.book.delete({
        where: {
          id: Number(req.params.id),
        },
      });

      res.json(book.quantity);
    } catch (error) {
      next(error);
    }
  }
);

export default router;