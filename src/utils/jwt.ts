import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_change_in_production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface TokenPayload {
  userId: bigint;
  email: string;
  role: string;
}

/**
 * Genera un token JWT
 */
export const generateToken = (payload: TokenPayload): string => {
  // Convertir bigint a string para JWT
  const sanitizedPayload = {
    userId: payload.userId.toString(),
    email: payload.email,
    role: payload.role,
  };

  return jwt.sign(sanitizedPayload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verifica y decodifica un token JWT
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Convertir userId de string a bigint
    return {
      userId: BigInt(decoded.userId),
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    return null;
  }
};