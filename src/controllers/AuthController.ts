import { Request, Response } from "express";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

// Registro de Usuarios
export const registerController = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "name, email y password son requeridos" });
      return;
    }

    const emailNorm = email.toLowerCase().trim();

    // (opcional) verifica si ya existe
    const exists = await UserModel.findOne({ where: { email: emailNorm } });
    if (exists) {
      res.status(409).json({ message: "El email ya está registrado" });
      return;
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email: emailNorm,
      // 👇 Usa la columna real en BD:
      password_hash: hashPassword,
    });

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      userId: newUser.id,
    });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Unexpected error" });
  }
};

// Login de Usuarios
export const loginController = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "email y password son requeridos" });
      return;
    }

    const emailNorm = email.toLowerCase().trim();

    // Trae explícitamente el hash
    const user = await UserModel.findOne({
      where: { email: emailNorm },
      attributes: ["id", "name", "email", "password_hash"],
    });

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      res.status(401).json({ message: "Contraseña incorrecta" });
      return;
    }

    res.status(200).json({ message: "Login exitoso" });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Unexpected error" });
  }
};
