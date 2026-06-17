import AppError from "./AppError.js";

export const categoryNotFound = (id) => {
    return new AppError (`Categoria con id ${id} no existe`, 400)
}

export const invalidPriceOrQuantity = (detail) => {
    return new AppError (`Datos inválido: ${detail}`, 400)
}

export const bookAlreadyExists = (title) => {
    return new AppError (`Libro con título ${title} ya existe`, 400)
}
