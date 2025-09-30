import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel.js";

interface RegisterBody {
  username: string; // Añadir
  name: string;
  last_name: string; // Añadir
  email: string;
  password: string;
  role: string;
}

interface LoginBody {
  email: string;
  password: string;
}

// 👉 Registro de usuarios
export const registerController = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
): Promise<void> => {
  try {
    // 1. Desestructura los nuevos campos
    const { username, name, last_name, email, password, role} = req.body;

    // 2. Añádelos a la validación
    if (!username || !name || !last_name || !email || !password) {
      res.status(400).json({ message: "Todos los campos son requeridos" });
      return;
    }

    // Normalizamos email
    const normalizedEmail = email.toLowerCase().trim();

    // verificar si el email ya existe
    const existingUser = await UserModel.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      res.status(409).json({ message: "El email ya está registrado" });
      return;
    }

    // hashear contraseña
    const hashPassword = await bcrypt.hash(password, 10);

    // 3. Pasa todos los campos requeridos a .create()
    const newUser = await UserModel.create({
      username,
      name,
      last_name,
      email: normalizedEmail,
      password: hashPassword,
      role
    });

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      userId: newUser.id,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Unexpected error",
    });
  }
};

// 👉 Login de usuarios
export const loginController = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email y password son requeridos" });
      return;
    }

    // Normalizamos email
    const normalizedEmail = email.toLowerCase().trim();

    // buscar usuario por email normalizado
    const user = await UserModel.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    // comparar contraseña ingresada con la hasheada en BD
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      res.status(401).json({ message: "Contraseña incorrecta" });
      return;
    }

    res.status(200).json({ message: "Login exitoso" });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Unexpected error",
    });
  }
};