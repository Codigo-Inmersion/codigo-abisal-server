import express from 'express';
import {getAllArticles,getArticleById, deleteArticle,createArticle,updateArticle} from '../controllers/ArticleController.js';
import { authMiddleware, requireRole } from '../middlewares/auth.js';
import { createArticleValidators, updateArticleValidators, idParamValidators } from '../validators/articleValidators.js';
import { checkValidations } from "../middlewares/articleMiddlewares.js";



const articleRouter = express.Router();

// Rutas públicas (sin autenticación)
articleRouter.get("/", getAllArticles);
articleRouter.get("/:id", getArticleById, idParamValidators,checkValidations);

// Rutas protegidas (requieren autenticación)
articleRouter.post("/", authMiddleware, createArticle, createArticleValidators, checkValidations);
articleRouter.put("/:id", authMiddleware, updateArticle, updateArticleValidators, checkValidations);
articleRouter.delete("/:id", authMiddleware, deleteArticle);

// articleRouter.delete("/:id", authMiddleware, requireRole("admin"), deleteArticle);

export default articleRouter;