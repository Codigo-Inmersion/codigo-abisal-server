
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel.js";
import { generateToken } from "../utils/jwt.js";

interface RegisterBody {
  username: string;
  name: string;
  last_name: string;
  email: string;
  password: string;
  role?: string;
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
    // 1. Desestructura los campos
    const { username, name, last_name, email, password, role } = req.body;

    // 2. Validación
    if (!username || !name || !last_name || !email || !password) {
      res.status(400).json({ message: "Todos los campos son requeridos" });
      return;
    }

    // Normalizamos email
    const normalizedEmail = email.toLowerCase().trim();

    // verificar si el email ya existe
    const existingUser = await UserModel.findOne({ 
      where: { email: normalizedEmail } 
    });
    
    if (existingUser) {
      res.status(409).json({ message: "El email ya está registrado" });
      return;
    }

    // verificar si el usuario ya existe
    const normalizedUserName = username.toLowerCase().trim();

    const existingUsername = await UserModel.findOne({ 
      where: { username: normalizedUserName } 
    });
    
    if (existingUsername) {
      res.status(409).json({ message: "El usuario ya está registrado" });
      return;
    }

    // hashear contraseña
    const hashPassword = await bcrypt.hash(password, 10);

    // 3. Crear usuario
    const newUser = await UserModel.create({
      username,
      name,
      last_name,
      email: normalizedEmail,
      password: hashPassword,
      role: role || "user", // Por defecto "user"
    });

    // 4. Generar token JWT
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      // user: {
      //   id: newUser.id.toString(),
      //   username: newUser.username,
      //   email: newUser.email,
      //   name: newUser.name,
      //   last_name: newUser.last_name,
      //   role: newUser.role,
      // },
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
    const user = await UserModel.findOne({ 
      where: { email: normalizedEmail } 
    });
    
if (!user || !(await bcrypt.compare(password, user.password))) {
      // Devolvemos 401 con un mensaje genérico
      res.status(401).json({ message: "Email o contraseña incorrectos" });
      return;
    }

    // Generar token JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({ 
      message: "Login exitoso",
      token,
      // user: {
      //   id: user.id.toString(),
      //   username: user.username,
      //   email: user.email,
      //   name: user.name,
      //   last_name: user.last_name,
      //   role: user.role,
      // },
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Unexpected error",
    });
  }
};