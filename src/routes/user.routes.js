import { Router } from "express";
import { prisma } from "../db.js";
import AppError from "../utils/AppError.js";
import validateFields from "../middleware/validateFields.js";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUserValidators,
  updateUserValidators,
  validateUserId,
} from "../validators/user.validators.js";

const SALT_ROUNDS = 10;
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "cambiar_esto_en_produccion";

// ─────────────────────────────────────────────
// GET /api/user
// Solo SUPERADMIN puede ver todos los usuarios
// ─────────────────────────────────────────────
router.get(
  "/user",
  verifyToken,
  authorizeRoles("SUPERADMIN"),
  async (req, res, next) => {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true },
      });
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
);

// ─────────────────────────────────────────────
// GET /api/user/:id
// Solo SUPERADMIN puede ver un usuario por ID
// ─────────────────────────────────────────────
router.get(
  "/user/:id",
  verifyToken,
  authorizeRoles("SUPERADMIN"),
  validateUserId,
  validateFields,
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        select: { id: true, name: true, email: true, role: true },
      });

      if (!user) {
        return next(new AppError(`Usuario con id ${id} no existe`, 404));
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

// ─────────────────────────────────────────────
// POST /api/user — Register
// Público — cualquiera puede registrarse (rol USER por defecto)
// ─────────────────────────────────────────────
router.post(
  "/user",
  createUserValidators,
  validateFields,
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      if (password.length < 6) {
        return next(new AppError("La contraseña debe tener al menos 6 caracteres", 400));
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return next(new AppError(`El email ${email} ya está registrado`, 400));
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(201).json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ─────────────────────────────────────────────
// POST /api/auth/login — Login
// Público
// ─────────────────────────────────────────────
router.post("/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Email y contraseña son obligatorios", 400));
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(new AppError("Email o contraseña incorrectos", 401));
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return next(new AppError("Email o contraseña incorrectos", 401));
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────
// PUT /api/user/:id
// Solo SUPERADMIN puede reemplazar un usuario completo
// ─────────────────────────────────────────────
router.put(
  "/user/:id",
  verifyToken,
  authorizeRoles("SUPERADMIN"),
  validateUserId,
  updateUserValidators,
  validateFields,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { id: Number(id) } });
      if (!existingUser) {
        return next(new AppError(`Usuario con id ${id} no existe`, 404));
      }

      if (!name || !email || !password) {
        return next(new AppError("name, email y password son obligatorios en PUT", 400));
      }

      if (password.length < 6) {
        return next(new AppError("La contraseña debe tener al menos 6 caracteres", 400));
      }

      const emailInUse = await prisma.user.findUnique({ where: { email } });
      if (emailInUse && emailInUse.id !== Number(id)) {
        return next(new AppError(`El email ${email} ya está registrado`, 400));
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const user = await prisma.user.update({
        where: { id: Number(id) },
        data: { name, email, password: hashedPassword },
      });

      res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
      next(error);
    }
  }
);

// ─────────────────────────────────────────────
// PATCH /api/user/:id
// Solo SUPERADMIN puede actualizar campos sueltos (incluido el role)
// ─────────────────────────────────────────────
router.patch(
  "/user/:id",
  verifyToken,
  authorizeRoles("SUPERADMIN"),
  validateUserId,
  validateFields,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, email, password, role } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { id: Number(id) } });
      if (!existingUser) {
        return next(new AppError(`Usuario con id ${id} no existe`, 404));
      }

      if (password && password.length < 6) {
        return next(new AppError("La contraseña debe tener al menos 6 caracteres", 400));
      }

      if (email) {
        const emailInUse = await prisma.user.findUnique({ where: { email } });
        if (emailInUse && emailInUse.id !== Number(id)) {
          return next(new AppError(`El email ${email} ya está registrado`, 400));
        }
      }

      const validRoles = ["USER", "ADMIN", "SUPERADMIN"];
      if (role && !validRoles.includes(role)) {
        return next(new AppError(`Rol inválido. Los roles válidos son: ${validRoles.join(", ")}`, 400));
      }

      const data = {};
      if (name) data.name = name;
      if (email) data.email = email;
      if (role) data.role = role;
      if (password) data.password = await bcrypt.hash(password, SALT_ROUNDS);

      if (Object.keys(data).length === 0) {
        return next(new AppError("No se envió ningún campo para actualizar", 400));
      }

      const user = await prisma.user.update({
        where: { id: Number(id) },
        data,
      });

      res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
      next(error);
    }
  }
);

// ─────────────────────────────────────────────
// DELETE /api/user/:id
// Solo SUPERADMIN puede eliminar usuarios
// ─────────────────────────────────────────────
router.delete(
  "/user/:id",
  verifyToken,
  authorizeRoles("SUPERADMIN"),
  validateUserId,
  validateFields,
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const existingUser = await prisma.user.findUnique({ where: { id: Number(id) } });
      if (!existingUser) {
        return next(new AppError(`Usuario con id ${id} no existe`, 404));
      }

      await prisma.user.delete({ where: { id: Number(id) } });

      res.json({ message: `Usuario con id ${id} eliminado correctamente` });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
