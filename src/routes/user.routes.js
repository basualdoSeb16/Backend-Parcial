import { Router } from "express";
import validateFields from "../middleware/validateFields.js";

import {
  createUserValidators,
  updateUserValidators,
  validateUserId,
} from "../validators/user.validators.js";

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = Router();

// Obtener todos los usuarios
router.get("/user", getUsers);

// Obtener usuario por ID
router.get(
  "/user/:id",
  validateUserId,
  validateFields,
  getUserById
);

// Crear usuario
router.post(
  "/user",
  createUserValidators,
  validateFields,
  createUser
);

// Actualizar usuario
router.put(
  "/user/:id",
  validateUserId,
  updateUserValidators,
  validateFields,
  updateUser
);

// Eliminar usuario
router.delete(
  "/user/:id",
  validateUserId,
  validateFields,
  deleteUser
);

export default router;