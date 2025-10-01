import { body } from "express-validator";

const emailRule = body("email")
  .trim()
  .toLowerCase()
  .isEmail()
  .withMessage("Email inválido")
  .matches(/@/)
  .withMessage("El email debe contener '@'");

const passwordRule = body("password")
  .isString()
  .isLength({ min: 8, max: 255 })
  .withMessage("La contraseña debe tener al menos 8 caracteres");

export const registerValidator = [
  body("username")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("username debe tener mínimo 2 caracteres"),
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("name es requerido"),
  body("last_name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("last_name es requerido"),
  emailRule,
  passwordRule,
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("role debe ser 'user' o 'admin'"),
];

export const loginValidator = [emailRule, passwordRule];
