import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

const JWT_SECRET = process.env.JWT_SECRET || "cambiar_esto_en_produccion";

export default function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new AppError("No hay token, acceso denegado", 401));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.id = decoded.id;
    req.role = decoded.role;
    next();
  } catch {
    return next(new AppError("Token inválido o expirado", 401));
  }
}