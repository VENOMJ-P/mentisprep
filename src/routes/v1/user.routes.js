import express from "express";
import {
  validateSchema,
  userSchemas,
} from "../../middlewares/user-validation.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import UserController from "../../controllers/user.controller.js";

const router = express.Router();
const userController = new UserController();

router.post(
  "/register",
  validateSchema(userSchemas.register),
  userController.register
);
router.post("/login", validateSchema(userSchemas.login), userController.login);

// Protected routes
router.use(authenticate);
router.post("/logout", userController.logout);
router.get("/me", authenticate, userController.getCurrentUser);
router.get("/:username", userController.getUserByUsername);

export default router;
