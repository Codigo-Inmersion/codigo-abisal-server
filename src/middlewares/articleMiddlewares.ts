// 1) Importo lo necesario de express y express-validator
// import { validationResult } from "express-validator";
// import type { Request, Response, NextFunction } from "express";

// // 2) Middleware que revisa si hubo errores de validación
// export function checkValidations(req: Request, res: Response, next: NextFunction) {
//   // 3) Recoge el resultado de todos los body()/param()/query() anteriores
//   const errors = validationResult(req);

//   // 4) Si hay errores, respondemos 400 con un listado claro
//   if (!errors.isEmpty()) {
//     return res.status(400).json({
//       message: "Error de validación",
//       // 5) Solo mostramos el primer error por campo (más limpio para el front)
//       errors: errors.array({ onlyFirstError: true }).map((e: any) => ({
//         field: e.param,        // ← NOMBRE DEL CAMPO (p.ej., "title", "id")
//         message: e.msg,        // ← MENSAJE que pusiste con .withMessage(...)
//         location: e.location,  // ← DONDE falló: "body" | "params" | "query"
//       })),
//     });
//   }

//   // 6) Si no hay errores, seguimos al siguiente middleware/controlador
//   next();
// }

