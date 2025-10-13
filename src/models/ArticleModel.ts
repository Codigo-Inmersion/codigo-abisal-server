// 1) Importo tipos y utilidades de Sequelize
import { DataTypes, Model, Optional } from "sequelize";
// 2) Importo mi conexión a la base de datos (tu Sequelize ya configurado)
import db_connection from "../database/db_connection.js";
import { ArticleAttributes } from "../interface/articleInterface.js";
import { User } from './UserModel.js';


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
  declare id: number; // Cambié de 'bigint' a 'number' (equivalente a 'integer' en JS)
  declare creator_id: number; // Cambié de 'bigint' a 'number' (equivalente a 'integer' en JS)
  declare title: string;
  declare description: string;
  declare content: string;
  declare category: string;
  declare species: string;
  declare image: string;
  declare references: string;
  declare created_at: Date;
  declare updated_at: Date;
  declare likes: number;
}

// 6) Inicializo (equivalente a define) y mapeo columnas/validaciones
Article.init(
  {
    id: {
      type: DataTypes.INTEGER, // Cambié de DataTypes.BIGINT a DataTypes.INTEGER
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "titulo no puede estar vacío" },
        len: { args: [3, 255], msg: "titulo mínimo 3 caracteres" },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "descripcion no puede estar vacío" },
        len: { args: [3, 255], msg: "descripcion mínimo 3 caracteres" },
      },
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      validate: {
        notNull: { msg: "content no puede estar vacío" },
        len: { args: [6, 65535], msg: "content mínimo 6 caracteres" },
      },
    },
   category: {
  type: DataTypes.ENUM('Fauna Abisal', 'Ecosistemas', 'Exploración', 'Conservación'),
  allowNull: false,
  validate: {
    notNull: { msg: "category no puede estar vacío" },
    isIn: {
      args: [['Fauna Abisal', 'Ecosistemas', 'Exploración', 'Conservación']],  // Esta es la validación isIn
      msg: "category debe ser uno de los siguientes: 'Fauna Abisal', 'Ecosistemas', 'Exploración', 'Conservación'"
    }
  },
},
    species: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "species no puede estar vacío" },
        len: { args: [6, 255], msg: "species mínimo 6 caracteres" },
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: { args: [6, 255], msg: "image mínimo 6 caracteres" },
      },
    },
    references: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: { args: [6, 255], msg: "references mínimo 6 caracteres" },
      },
    },
    creator_id: {
      type: DataTypes.INTEGER, // Cambié de DataTypes.BIGINT a DataTypes.INTEGER
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
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
    likes: { // <-- AÑADIR ESTE CAMPO
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize: db_connection, // ← tu conexión
    tableName: "articles", // ← nombre real de la tabla
    timestamps: true, // ← activa created/updated
    underscored: true, // ← columnas snake_case
    createdAt: "created_at", // ← mapea el nombre
    updatedAt: "updated_at", // ← mapea el nombre
  }
);

export const UserLikes = db_connection.define('user_likes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, {
  timestamps: false,
  tableName: 'user_likes',
});

User.belongsToMany(Article, { through: UserLikes, as: 'likedArticles' });
Article.belongsToMany(User, { through: UserLikes, as: 'likedByUsers' });


// 7) ¡Exporto el modelo! (puedes default o nombrado)
export default Article;
