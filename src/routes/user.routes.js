/**
 * @fileoverview Rutas CRUD para la entidad User.
 * Endpoints para obtener, crear, actualizar y eliminar usuarios.
 */

import { Router } from "express";
import { prisma } from "../db.js";
import AppError from "../utils/AppError.js";
import validateFields from "../middleware/validateFields.js";

import {
  createUserValidators,
  updateUserValidators,
  validateUserId,
} from "../validators/user.validators.js";

const router = Router();

/**
 * GET /user
 * Obtiene todos los usuarios.
 */
router.get("/user", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();

    res.json(users);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /user/:id
 * Obtiene un usuario por su ID.
 */
router.get(
  "/user/:id",
  validateUserId,
  validateFields,
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!user) {
        return next(
          new AppError(`Usuario con id ${id} no existe`, 404)
        );
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /user
 * Crea un nuevo usuario.
 */
router.post(
  "/user",
  createUserValidators,
  validateFields,
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      // Validación de contraseña
      if (password.length < 6) {
        return next(
          new AppError(
            "La contraseña debe tener al menos 6 caracteres",
            400
          )
        );
      }

      // Verifica que el email no exista
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return next(
          new AppError(
            `El email ${email} ya está registrado`,
            400
          )
        );
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password,
        },
      });

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /user/:id
 * Actualiza un usuario existente.
 */
router.put(
  "/user/:id",
  validateUserId,
  updateUserValidators,
  validateFields,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      // Verifica que el usuario exista
      const existingUser = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!existingUser) {
        return next(
          new AppError(`Usuario con id ${id} no existe`, 404)
        );
      }

      // Validación de contraseña
      if (password && password.length < 6) {
        return next(
          new AppError(
            "La contraseña debe tener al menos 6 caracteres",
            400
          )
        );
      }

      // Verifica email duplicado
      if (email) {
        const emailInUse = await prisma.user.findUnique({
          where: { email },
        });

        if (
          emailInUse &&
          emailInUse.id !== Number(id)
        ) {
          return next(
            new AppError(
              `El email ${email} ya está registrado`,
              400
            )
          );
        }
      }

      const user = await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          email,
          password,
        },
      });

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /user/:id
 * Elimina un usuario.
 */
router.delete(
  "/user/:id",
  validateUserId,
  validateFields,
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const existingUser = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!existingUser) {
        return next(
          new AppError(`Usuario con id ${id} no existe`, 404)
        );
      }

      const user = await prisma.user.delete({
        where: {
          id: Number(id),
        },
      });

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

export default router;