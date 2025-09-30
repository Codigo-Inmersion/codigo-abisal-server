import { Article } from "../models/ArticleModel.js";
import type { Request, Response } from "express";

export const getAllArticles = async (_req: Request, res: Response) => {
    try {
        const articles = await Article.findAll()
        res.status(200).json(articles)
    } catch (error) {

        res.status(500).json({ message: "Error obteniendo artículos", error });
    }
};

export const getArticleById = async (req: Request<{ id: string }>, res: Response) => {
    try {

        const { id } = req.params;

        // Buscamos por clave primaria con Sequelize (findByPk)
        const article = await Article.findByPk(id);

        // Si no existe, respondemos 404 Not Found
        if (!article) {
            return res.status(404).json({ message: "Artículo no encontrado" });
        }
        // Si existe, 200 OK con el artículo
        res.status(200).json(article);
    } catch (error) {
        //  Cualquier error inesperado -> 500
        res.status(500).json({ message: "Error obteniendo el artículo" });
    }

}

export const deleteArticle = async (req: Request, res: Response) => {
    try {
        const deleted = await Article.destroy({ where: { id: req.params.id } });
        if (deleted === 0) {
            return res.status(404).json({ message: "Artículo no encontrado" });
        }
        res.status(200).json({ message: "El articulo esta eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "No se pudo eliminar el articulo" });
    }
}

export const createArticle = async (req: Request, res: Response) => {
  try {
    //  Aquí filtramos los campos que sí queremos guardar
    const {title, description, content, category, species, image, references, creator_id, } = req.body;

    //  Creamos el artículo solo con esos campos (los demás se ignoran)
    const newArticle = await Article.create({ 
      title,
      description,
      content,
      category,
      species,
      image,
      references,
      creator_id,
    });

    return res.status(201).json(newArticle);
  } catch (error) {
    return res.status(500).json({ message: "No se pudo crear el artículo" });
  }
};

//Defino el tipo del body para el update (todos opcionales)
interface UpdateArticleDTO {
  title?: string;
  description?: string;
  content?: string;
  category?: string;
  species?: string;
  image?: string;
  references?: string;
}
export const updateArticle = async (
  req: Request<{ id: string }, unknown, UpdateArticleDTO>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const article = await Article.findByPk(id);

    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    // Filtramos los campos que pueden actualizarse
    const { title, description, content, category, species, image, references } = req.body;

    await article.update({ title, description, content, category, species, image, references,});

    return res.status(200).json({
      message: "Artículo actualizado correctamente",
      article,
    });
  } catch (_error) {
    return res.status(500).json({ message: "Error actualizando el artículo" });
  }
};
