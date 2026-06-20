import { prisma } from "../db.js";
import AppError from "../utils/AppError.js";

// Obtiene todos los usuarios
export async function getUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany();

    res.json(users);
  } catch (error) {
    next(error);
  }
}

// Obtiene usuario por ID
export async function getUserById(req, res, next) {
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

// Crea usuario
export async function createUser(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (password.length < 6) {
      return next(
        new AppError(
          "La contraseña debe tener al menos 6 caracteres",
          400
        )
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(
        new AppError(`El email ${email} ya está registrado`, 400)
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

// Actualiza usuario
export async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      return next(
        new AppError(`Usuario con id ${id} no existe`, 404)
      );
    }

    if (password && password.length < 6) {
      return next(
        new AppError(
          "La contraseña debe tener al menos 6 caracteres",
          400
        )
      );
    }

    if (email) {
      const emailInUse = await prisma.user.findUnique({
        where: { email },
      });

      if (emailInUse && emailInUse.id !== Number(id)) {
        return next(
          new AppError(`El email ${email} ya está registrado`, 400)
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

// Elimina usuario
export async function deleteUser(req, res, next) {
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