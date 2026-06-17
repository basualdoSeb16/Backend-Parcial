import { body, param } from "express-validator";


export const createUserValidators = [
  body("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio"),

  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Debe ingresar un email válido"),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
]


export const updateUserValidators = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Debe ingresar un email válido"),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
]


export const validateUserId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El id debe ser un número entero positivo"),
]