import { prisma } from "../db.js";
import AppError from "../utils/AppError.js";


  //Obtiene todas las categorías con sus libros asociados.
 
export async function getCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        books: true,
      },
    });

    res.json(categories);
  } catch (error) {
    next(error);
  }
}


 // Obtiene una categoría por ID.
 
export async function getCategoryById(req, res, next) {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return next(new AppError("ID inválido", 400));
    }

    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        books: true,
      },
    });

    if (!category) {
      return next(
        new AppError(`Categoría con id ${id} no existe`, 404)
      );
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
}


 // Crea una nueva categoría.

export async function createCategory(req, res, next) {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return next(
        new AppError("El nombre de la categoría es obligatorio", 400)
      );
    }

    const existingCategory = await prisma.category.findFirst({
      where: { name },
    });

    if (existingCategory) {
      return next(
        new AppError(`La categoría ${name} ya existe`, 400)
      );
    }

    const category = await prisma.category.create({
      data: { name },
    });

    res.json(category);
  } catch (error) {
    if (error?.code === "P2002") {
      return next(
        new AppError(`La categoría ${req.body?.name} ya existe`, 400)
      );
    }

    next(error);
  }
}


 // Actualiza parcialmente una categoría.
 
export async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (isNaN(Number(id))) {
      return next(new AppError("ID inválido", 400));
    }

    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!category) {
      return next(
        new AppError(`Categoría con id ${id} no existe`, 404)
      );
    }

    if (name !== undefined) {
      if (name.trim() === "") {
        return next(
          new AppError("El nombre de la categoría es obligatorio", 400)
        );
      }

      const duplicate = await prisma.category.findFirst({
        where: { name },
      });

      if (duplicate && duplicate.id !== Number(id)) {
        return next(
          new AppError(`La categoría ${name} ya existe`, 400)
        );
      }
    }

    const updated = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
      },
    });

    res.json(updated);
  } catch (error) {
    if (error?.code === "P2002") {
      return next(
        new AppError(`La categoría ${req.body?.name} ya existe`, 400)
      );
    }

    next(error);
  }
}

// Elimina una categoría por ID.

export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return next(new AppError("ID inválido", 400));
    }

    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!category) {
      return next(
        new AppError(`Categoría con id ${id} no existe`, 404)
      );
    }

    const deleted = await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });

    res.json(deleted);
  } catch (error) {
    next(error);
  }
}