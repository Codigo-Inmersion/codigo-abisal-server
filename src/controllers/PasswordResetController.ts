import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";
import PasswordResetToken from "../models/PasswordResetToken.js";
import { generateRawToken, hashToken } from "../utils/resetToken.js";

// Enviar email (usa nodemailer en prod; aquí vamos a loguear el link en dev)
async function sendResetEmail(to: string, url: string) {
  if (process.env.NODE_ENV === "production") {
    // TODO: integra nodemailer o tu proveedor (Sendgrid, SES, etc.)
  } else {
    console.log("🔗 Reset link (dev):", url);
  }
}

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const normalizedEmail = String(req.body.email).toLowerCase().trim();

  // Respuesta genérica SIEMPRE (no revelar si existe)
  const generic = { message: "Si el email existe, te enviaremos instrucciones para restablecer tu contraseña." };

  // Busca usuario
  const user = await User.findOne({ where: { email: normalizedEmail } });
  if (!user) {
    res.status(200).json(generic);
    return;
  }

  // Genera token
  const rawToken = generateRawToken();
  const tokenHash = hashToken(rawToken);
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

  // Opcional: invalida tokens previos no usados
  await PasswordResetToken.update(
    { used_at: new Date() },
    { where: { user_id: user.id, used_at: null } }
  );

  // Guarda token
  await PasswordResetToken.create({
    user_id: user.id,
    token_hash: tokenHash,
    expires_at: expires,
  });

  // Construye URL de reset
  const resetUrl = `${process.env.FRONTEND_URL ?? "http://localhost:5173"}/reset-password?token=${rawToken}`;

  // Manda email (o log en dev)
  await sendResetEmail(user.email, resetUrl);

  res.status(200).json(generic);
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body as { token: string; newPassword: string };

  const tokenHash = hashToken(token);
  const now = new Date();

  // Busca token válido
  const prt = await PasswordResetToken.findOne({
    where: {
      token_hash: tokenHash,
      used_at: null,
    },
  });

  if (!prt || prt.expires_at < now) {
    res.status(400).json({ message: "Token inválido o expirado" });
    return;
  }

  // Busca usuario
  const user = await User.findByPk(prt.user_id);
  if (!user) {
    res.status(400).json({ message: "Token inválido" });
    return;
  }

  // Actualiza contraseña
  const hash = await bcrypt.hash(newPassword, 10);
  user.password = hash;
  await user.save();

  // Marca token como usado
  prt.used_at = new Date();
  await prt.save();

  res.status(200).json({ message: "Contraseña restablecida correctamente. Ya puedes iniciar sesión." });
};
