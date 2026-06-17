import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

// GET /users - Traer todos los usuarios
router.get("/users", async (req, res, next) => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// GET /users/:id - Traer un usuario por su ID
router.get("/users/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// POST /users - Crear un nuevo usuario
router.post("/users", async (req, res, next) => {
  try {
    const { name, email,  password } = req.body;

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password
      },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// PUT /users/:id - Actualizar un usuario por su ID
router.put("/users/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await prisma.users.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        email,
        password
      },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// DELETE /users/:id - Eliminar un usuario por su ID
router.delete("/users/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.users.delete({
      where: {
        id: Number(id),
      },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;