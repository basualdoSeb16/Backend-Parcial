import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import validateFields from "../middleware/validateFields.js";
import {
  createUserValidators,
  updateUserValidators,
  validateUserId,
} from "../validators/user.validators.js";
import {
  getUsers,
  getUserById,
  registerUser,
  loginUser,
  replaceUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/user", verifyToken, authorizeRoles("SUPERADMIN"), getUsers);

router.get("/user/:id", verifyToken, authorizeRoles("SUPERADMIN"), validateUserId, validateFields, getUserById);

router.post("/user", createUserValidators, validateFields, registerUser);

router.post("/auth/login", loginUser);

router.put("/user/:id", verifyToken, authorizeRoles("SUPERADMIN"), validateUserId, updateUserValidators, validateFields, replaceUser);

router.patch("/user/:id", verifyToken, authorizeRoles("SUPERADMIN"), validateUserId, validateFields, updateUser);

router.delete("/user/:id", verifyToken, authorizeRoles("SUPERADMIN"), validateUserId, validateFields, deleteUser);

export default router;
