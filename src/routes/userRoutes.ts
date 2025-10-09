import { Router, Request, Response } from "express";
import User from "../models/UserModel.js"

const router = Router();

/**
 * GET /user/:id
 * Devuelve datos públicos del usuario (id, username, name)
 */
router.get("/user/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    // 1️⃣ Validamos que el ID sea un número válido
    if (Number.isNaN(id) || id < 1) {
      return res.status(400).json({ message: "id inválido" });
    }

    // 2️⃣ Buscamos al usuario en la base de datos
    const user = await User.findByPk(id, {
      attributes: ["id", "username", "name"], // 👈 solo devolvemos datos públicos
    });

    // 3️⃣ Si no existe, devolvemos 404
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 4️⃣ Si todo va bien, devolvemos el usuario en formato JSON
    return res.json(user);
  } catch (error) {
    console.error("Error en GET /user/:id:", error);
    return res.status(500).json({ message: "Error al obtener usuario" });
  }
});

export default router;
