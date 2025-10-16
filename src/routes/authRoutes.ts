import express from "express";
import { registerController, loginController } from "../controllers/AuthController.js";
import { registerValidator, loginValidator } from "../validators/userValidators.js";
import { handleValidation } from "../middlewares/authMiddlewares.js";

const authRouter = express.Router();

// Registro con validación
authRouter.post(
  "/register",
  registerValidator,
  handleValidation,
  registerController
);

// Login con validación
authRouter.post(
  "/login",
  loginValidator,
  handleValidation,
  loginController
);

export default authRouter;
