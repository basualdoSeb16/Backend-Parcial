import { body, param } from "express-validator";

export const validateBookId = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("El id debe ser un número entero positivo")
    .toInt(),
];

export const createBookValidators = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("El título es obligatorio")
    .bail()
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres"),

  body("author")
    .trim()
    .notEmpty()
    .withMessage("El autor es obligatorio")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("El autor debe tener entre 3 y 100 caracteres"),

  body("publishedYear")
    .notEmpty()
    .withMessage("El año de publicación es obligatorio")
    .bail()
    .isInt({ min: 1000, max: 9999 })
    .withMessage("El año debe tener 4 dígitos")
    .toInt(),

  body("price")
    .notEmpty()
    .withMessage("El precio es obligatorio")
    .bail()
    .isFloat({ gt: 0 })
    .withMessage("El precio debe ser un número decimal positivo")
    .toFloat(),

  body("quantity")
    .notEmpty()
    .withMessage("La cantidad es obligatoria")
    .bail()
    .isInt({ gte: 0 })
    .withMessage("La cantidad debe ser un número entero no negativo")
    .toInt(),

  body("categorId")
    .notEmpty()
    .withMessage("La categoría es obligatoria")
    .bail()
    .isInt({ gt: 0 })
    .withMessage("El id de categoría debe ser un número entero positivo")
    .toInt(),
];

export const updateBookValidators = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("El id debe ser un número entero positivo")
    .toInt(),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres"),

  body("author")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("El autor debe tener entre 3 y 100 caracteres"),

  body("publishedYear")
    .optional()
    .isInt({ min: 1000, max: 9999 })
    .withMessage("El año debe tener 4 dígitos")
    .toInt(),

  body("price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("El precio debe ser un número decimal positivo")
    .toFloat(),

  body("quantity")
    .optional()
    .isInt({ gte: 0 })
    .withMessage("La cantidad debe ser un número entero no negativo")
    .toInt(),

  body("categorId")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("El id de categoría debe ser un número entero positivo")
    .toInt(),
];
