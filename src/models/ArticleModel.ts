// 1) Importo tipos y utilidades de Sequelize
import { DataTypes, Model, Optional } from "sequelize";
// 2) Importo mi conexión a la base de datos (tu Sequelize ya configurado)
import db_connection from "../database/db_connection.js";

// 3) Declaro cómo es un usuario en la BD (TODOS los campos)
export interface ArticleAttributes {
  id: bigint;
  creator_id: bigint; //TENER EN CUENTA QUE DEBE VENIR DEL MODELO DE USER
  title: string;
  description: string;
  content:string;
  category: string;
  species: string;
  image?: string;
  references?: string;
//   likes_count: bigint;
  created_at: Date;
  updated_at: Date;
}

// 4) Campos opcionales AL CREAR (Sequelize los rellena solo)
export type ArticleCreationAttributes = Optional<
  ArticleAttributes,
  "id" | "created_at" | "updated_at" | "image" | "references"
>;

// 5) Defino la clase del modelo (tipada)
export class Article
  extends Model<ArticleAttributes, ArticleCreationAttributes>
  implements ArticleAttributes
{
  declare id: bigint;
  declare creator_id: bigint;
  declare title: string;
  declare description: string;
  declare content: string;
  declare category: string;
  declare species: string;
  declare image: string;
  declare references: string;
  declare created_at: Date;
  declare updated_at: Date;

}


// 6) Inicializo (equivalente a define) y mapeo columnas/validaciones
Article.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "titulo no puede estar vacío" },
        len: { args: [3, 255], msg: "username mínimo 3 caracteres" },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "descripcion no puede estar vacío" },
        len: { args: [3, 255], msg: "username mínimo 3 caracteres" },
      },
    },
    
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      validate: {
        notNull: { msg: "content no puede estar vacío" },
        len: { args: [6, 255], msg: "content mínimo 6 caracteres" },
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
       validate: {
        notNull: { msg: "content no puede estar vacío" },
        len: { args: [6, 255], msg: "content mínimo 6 caracteres" },
      },
    },

    species: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "content no puede estar vacío" },
        len: { args: [6, 255], msg: "content mínimo 6 caracteres" },
      },
    },
      image: {
      type: DataTypes.STRING,
      allowNull: true,
       validate: {
        len: { args: [6, 255], msg: "content mínimo 6 caracteres" },
      },
    },

      references: {
      type: DataTypes.STRING,
      allowNull: true,
       validate: {
       len: { args: [6, 255], msg: "content mínimo 6 caracteres" },
      },
    },
    creator_id: {
      type: DataTypes.BIGINT,
       allowNull: false,
       references: {
        model: 'users',
        key: 'id'
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: db_connection,           // ← tu conexión
    tableName: "articles",      // ← nombre real de la tabla
    timestamps: true,        // ← activa created/updated
    underscored: true,       // ← columnas snake_case
    createdAt: "created_at", // ← mapea el nombre
    updatedAt: "updated_at", // ← mapea el nombre
  }
);

// 7) ¡Exporto el modelo! (puedes default o nombrado)
export default Article;

