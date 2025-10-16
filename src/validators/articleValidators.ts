import { body, param } from "express-validator";

export const createArticleValidators = [
  // title: string mínimo 3
  body("title")
    .isString().withMessage("title debe ser un string")      // ← comprueba tipo
    .trim()                                                   // ← recorta espacios
    .isLength({ min: 10 }).withMessage("title mínimo 10 caracteres"),

  // description: string mínimo 3
  body("description")
    .isString().withMessage("description debe ser un string")
    .trim()
    .isLength({ min: 3 }).withMessage("description mínimo 3 caracteres"),

 // category: Validación con enum
  body("category")
    .isString().withMessage("category debe ser un string")
    .trim()
    .isIn(['Fauna Abisal', 'Ecosistemas', 'Exploración', 'Conservación'])
    .withMessage("category debe ser uno de los siguientes: 'Fauna Abisal', 'Ecosistemas', 'Exploración', 'Conservación'"),

  body("category")
    .isString().withMessage("category debe ser un string")
    .trim()
    .isLength({ min: 6 }).withMessage("category mínimo 6 caracteres"),

  // species: string mínimo 6
  body("species")
    .isString().withMessage("species debe ser un string")
    .trim()
    .isLength({ min: 6 }).withMessage("species mínimo 6 caracteres"),

  // image: opcional, si viene debe ser URL
  body("image")
    .optional()                                              // ← no obligatorio
    .isURL().withMessage("image debe ser una URL válida"),

  // references: opcional, si viene mínimo 6
  body("references")
    .optional()
    .isString().withMessage("references debe ser un string")
    .trim()
    .isLength({ min: 6 }).withMessage("references mínimo 6 caracteres"),
];

/**
 * ✅ Validadores para ACTUALIZAR artículo (PUT /articles/:id)
 * - :id en params debe ser entero positivo
 * - Todos los campos del body son OPCIONALES, pero si vienen, se validan.
 */
export const updateArticleValidators = [
  // Validamos el parámetro :id
  param("id")
    .isInt({ min: 1 }).withMessage("id debe ser un entero positivo"),

  // El resto igual que create, pero todos .optional()
  body("title")
    .optional()
    .isString().withMessage("title debe ser un string")
    .trim()
    .isLength({ min: 3 }).withMessage("title mínimo 3 caracteres"),

  body("description")
    .optional()
    .isString().withMessage("description debe ser un string")
    .trim()
    .isLength({ min: 3 }).withMessage("description mínimo 3 caracteres"),

  body("content")
    .optional()
    .isString().withMessage("content debe ser un string")
    .trim()
    .isLength({ min: 6 }).withMessage("content mínimo 6 caracteres"),

  body("category")
    .optional()
    .isString().withMessage("category debe ser un string")
    .trim()
    .isIn(['Fauna Abisal', 'Ecosistemas', 'Exploración', 'Conservación'])
    .withMessage("category debe ser uno de los siguientes: 'Fauna Abisal', 'Ecosistemas', 'Exploración', 'Conservación'"),


  body("species")
    .optional()
    .isString().withMessage("species debe ser un string")
    .trim()
    .isLength({ min: 6 }).withMessage("species mínimo 6 caracteres"),

  body("image")
    .optional()
    .isURL().withMessage("image debe ser una URL válida"),

  body("references")
    .optional()
    .isString().withMessage("references debe ser un string")
    .trim()
    .isLength({ min: 6 }).withMessage("references mínimo 6 caracteres"),
];

/**
 * ✅ Validadores para OBTENER por id (GET /articles/:id) o borrar
 * - Solo chequea que :id sea un entero positivo.
 */
export const idParamValidators = [
  param("id")
    .isInt({ min: 1 }).withMessage("id debe ser un entero positivo"),
];