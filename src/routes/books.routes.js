import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import validateFields from "../middleware/validateFields.js";
import {
  createBookValidators,
  updateBookValidators,
  validateBookId,
} from "../validators/book.validators.js";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/books.controller.js";

const router = Router();

router.get("/books", verifyToken, getBooks);

router.get("/books/:id", verifyToken, validateBookId, validateFields, getBookById);

router.post("/books", verifyToken, authorizeRoles("ADMIN", "SUPERADMIN"), createBookValidators, validateFields, createBook);

router.patch("/books/:id", verifyToken, authorizeRoles("ADMIN", "SUPERADMIN"), updateBookValidators, validateFields, updateBook);

router.delete("/books/:id", verifyToken, authorizeRoles("ADMIN", "SUPERADMIN"), validateBookId, validateFields, deleteBook);

export default router;
