import AppError from "./AppError.js";

export const categoryNotFound = (id) => {
  return new AppError(`Categoría con id ${id} no existe`, 404);
};

export const categoryAlreadyExists = (name) => {
  return new AppError(`La categoría ${name} ya existe`, 400);
};