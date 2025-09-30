import express from 'express'
import {getAllArticles, getArticleById, deleteArticle, createArticle , updateArticle} from '../controllers/ArticleController.js'
const articleRouter = express.Router()

articleRouter.get("/", getAllArticles)

articleRouter.get("/:id", getArticleById)

articleRouter.post("/", createArticle)

articleRouter.delete("/:id", deleteArticle)

articleRouter.put("/:id", updateArticle)

export default articleRouter