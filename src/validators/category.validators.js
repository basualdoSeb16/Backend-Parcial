import { body, param } from "express-validator";

export const createCategoryValidators = [
  body("name")
    .notEmpty()
    .withMessage("El nombre de la categoría es obligatorio"),
];

export const updateCategoryValidators = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("El nombre de la categoría no puede estar vacío"),
];

export const validateCategoryId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El id debe ser un número entero positivo"),
];