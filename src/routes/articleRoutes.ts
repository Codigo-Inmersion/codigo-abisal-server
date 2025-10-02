import express from 'express';
import {getAllArticles,getArticleById, deleteArticle,createArticle,updateArticle} from '../controllers/ArticleController.js';
import { authMiddleware, requireRole, handleValidation} from '../middlewares/auth.js';
import { createArticleValidators, updateArticleValidators, idParamValidators } from '../validators/articleValidators.js';
import { checkValidations } from "../middlewares/articleMiddlewares.js";



const articleRouter = express.Router();

// Rutas públicas (sin autenticación)
articleRouter.get("/", getAllArticles);
articleRouter.get("/:id", getArticleById, idParamValidators,checkValidations);

// Rutas protegidas (handleValidation, createArticle, createArticleValidators, checkValidations);
articleRouter.post("/", authMiddleware, requireRole("admin"),  createArticle, handleValidation, createArticleValidators,);
articleRouter.put("/:id", authMiddleware, requireRole("admin"),  handleValidation, updateArticle, updateArticleValidators, checkValidations);
articleRouter.delete("/:id",authMiddleware, requireRole("admin"),  handleValidation, deleteArticle);


export default articleRouter;