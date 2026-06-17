import AppError from "./AppError.js";

export const userNotFound = (id) => {
  return new AppError(`Usuario con id ${id} no existe`, 404);
};

export const emailAlreadyExists = (email) => {
  return new AppError(`El email ${email} ya está registrado`, 400);
};

export const invalidPassword = () => {
  return new AppError(
    "La contraseña debe tener al menos 6 caracteres",
    400
  );
};