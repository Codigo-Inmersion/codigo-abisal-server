import express from 'express';
import {getAllArticles,getArticleById, deleteArticle,createArticle,updateArticle, likeArticle, unlikeArticle } from '../controllers/ArticleController.js';
import { authMiddleware, requireRole, handleValidation} from '../middlewares/authMiddlewares.js';
import { createArticleValidators, updateArticleValidators, idParamValidators } from '../validators/articleValidators.js';
// import { checkValidations } from "../middlewares/articleMiddlewares.js";



const articleRouter = express.Router();

// Rutas públicas (sin autenticación)
articleRouter.get("/", getAllArticles);
articleRouter.get("/:id", idParamValidators, getArticleById,);

// Rutas protegidas (handleValidation, createArticle, createArticleValidators, checkValidations);
articleRouter.post("/", authMiddleware, requireRole(["admin", "user"]), createArticleValidators, handleValidation, createArticle,);
articleRouter.put("/:id", authMiddleware, requireRole(["admin"]), idParamValidators, updateArticleValidators, handleValidation, updateArticle,);
articleRouter.delete("/:id",authMiddleware, requireRole(["admin"]), idParamValidators,  handleValidation, deleteArticle);
// Dar like
articleRouter.post("/:id/like", authMiddleware, idParamValidators, handleValidation, likeArticle);

// Quitar like
articleRouter.delete("/:id/like", authMiddleware, idParamValidators, handleValidation, unlikeArticle);


export default articleRouter;