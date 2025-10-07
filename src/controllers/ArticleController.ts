import { Article } from "../models/ArticleModel.js";
import type { Request, Response} from "express";


export const getAllArticles = async (_req: Request, res: Response) => {
  try {
    const articles = await Article.findAll();
    if (!articles || articles.length === 0) {
      return res.status(404).json({ message: 'No se encontraron artículos' }); // Manejo explícito de error
    }
    res.status(200).json(articles); // Devuelve los artículos
  } catch (error) {
    console.error('Error obteniendo artículos:', error);
    res.status(500).json({ message: 'Error obteniendo artículos', error });
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
      //  const user = await User.findByPk(creator_id);  // Busca al usuario por su ID
     if (!req.user || !req.user.userId) {
      return res.status(400).json({ message: "El creador del artículo no está autenticado." });
    }

    //  Aquí filtramos los campos que sí queremos guardar
    const {title, description, content, category, species, image, references, } = req.body;
     // Verifica si algún campo esencial falta
     const creator_id = BigInt(req.user.userId).toString();// Convierte BigInt a string si es necesario
   
     console.log("Creador ID:", creator_id);  // Verifica que el creator_id sea correcto
     
    if (!title || !description || !content || !category || !species ) {
      console.error("Faltan datos necesarios para crear el artículo");
      return res.status(400).json({ message: "Faltan datos necesarios" });
    }   
   
    //  Creamos el artículo solo con esos campos (los demás se ignoran)
    
    const newArticle = await Article.create({   
      title,
      description,
      content,
      category,
      species,
      image,
      references,
      creator_id
}).catch((error) => {
      console.error("Error en la base de datos:", error);
      throw new Error("Simulación de error en la base de datos");
    });

    return res.status(201).json(newArticle);
  } catch (error) {
     console.error("Error en la base de datos:", error);
   if (error instanceof Error) {
      return res.status(500).json({
        message: "No se pudo crear el artículo",
        error: error.message // Ahora TypeScript sabe que 'error' tiene la propiedad 'message'
      });
    } else {
      // Si el error no es una instancia de Error, enviamos un mensaje genérico
      return res.status(500).json({
        message: "No se pudo crear el artículo",
        error: "Error desconocido"
      });
    }
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
