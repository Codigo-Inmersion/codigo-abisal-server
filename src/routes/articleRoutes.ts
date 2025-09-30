import express from 'express';
import {
  getAllArticles,
  getArticleById,
  deleteArticle,
  createArticle,
  updateArticle
} from '../controllers/ArticleController.js';
import { authMiddleware, requireRole } from '../middlewares/auth.js';

const articleRouter = express.Router();

// Rutas públicas (sin autenticación)
articleRouter.get("/", getAllArticles);
articleRouter.get("/:id", getArticleById);

// Rutas protegidas (requieren autenticación)
articleRouter.post("/", authMiddleware, createArticle);
articleRouter.put("/:id", authMiddleware, updateArticle);
articleRouter.delete("/:id", authMiddleware, deleteArticle);

// articleRouter.delete("/:id", authMiddleware, requireRole("admin"), deleteArticle);

export default articleRouter;