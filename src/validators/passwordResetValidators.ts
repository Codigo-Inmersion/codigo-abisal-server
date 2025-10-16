import { body } from "express-validator";

export const forgotValidator = [
  body("email").trim().toLowerCase().isEmail().withMessage("Email inválido"),
];

export const resetValidator = [
  body("token").isString().isLength({ min: 10 }).withMessage("Token inválido"),
  body("newPassword")
    .isString()
    .isLength({ min: 8 }).withMessage("La contraseña debe tener mínimo 8 caracteres")
    .matches(/[a-z]/).withMessage("Debe incluir minúscula")
    .matches(/[A-Z]/).withMessage("Debe incluir mayúscula")
    .matches(/\d/).withMessage("Debe incluir número")
    .matches(/[^\w\s]/).withMessage("Debe incluir símbolo"),
];
