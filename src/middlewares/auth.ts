import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../utils/jwt.js";

// Extender el tipo Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware que verifica si el usuario está autenticado
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: "No se proporcionó token de autenticación" });
      return;
    }

    // El formato esperado es: "Bearer <token>"
    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Formato de token inválido" });
      return;
    }

    // Verificar el token
    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({ message: "Token inválido o expirado" });
      return;
    }

    // Adjuntar la información del usuario al request
    req.user = decoded;

    // Continuar con el siguiente middleware o ruta
    next();
  } catch (error) {
    res.status(500).json({ message: "Error en la autenticación" });
  }
};

/**
 * Middleware que verifica si el usuario tiene un rol específico
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        message: "No tienes permisos para acceder a este recurso" 
      });
      return;
    }

    next();
  };
};