import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

router.get("/users", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.post("/users", async (req, res, next) => {
  try {
    const { name, email,  password } = req.body;

    const user = await prisma.user.create({
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

router.put("/users/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await prisma.user.update({
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

router.delete("/users/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.delete({
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