import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

/**
 * Middleware que revisa si hay errores de validación y los devuelve en formato 422.
 */
export function handleValidation(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    // En express-validator v7 la propiedad es "path" (antes era "param")
    const errors = result.array({ onlyFirstError: true }).map((err: any) => ({
      field: err.path ?? err.param ?? "unknown",
      msg: err.msg,
    }));

    return res.status(422).json({
      message: "Errores de validación",
      errors,
    });
  }

  next();
}
