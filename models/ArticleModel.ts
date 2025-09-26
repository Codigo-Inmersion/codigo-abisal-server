// 1) Importo tipos y utilidades de Sequelize
import { DataTypes, Model, Optional } from "sequelize";
// 2) Importo mi conexión a la base de datos (tu Sequelize ya configurado)
import db_connection from "../database/db_connection";

// 3) Declaro cómo es un usuario en la BD (TODOS los campos)
export interface ArticleAttributes {
  id: bigint;
  creator_id: bigint; //TENER EN CUENTA QUE DEBE VENIR DEL MODELO DE USER
  title: string;
  description: string;
  content: Text;
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
  "id" | "created_at" | "updated_at" |"references" | "image"
>;

// 5) Defino la clase del modelo (tipada)
export class Article
  extends Model<ArticleAttributes, ArticleCreationAttributes>
  implements ArticleAttributes
{
  public id!: bigint;
  public creator_id!: bigint;
  public title!: string;
  public description!: string;
  public content!: Text;
  public category!: string;
  public species!: string;
  public image!: string;
  public references!: string;
  public created_at!: Date;
  public updated_at!: Date;
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
        notNull: { msg: "título no puede estar vacío" },
        len: { args: [3, 255], msg: "título mínimo 3 caracteres" },
      },
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "description no puede estar vacío" },
        len: { args: [3, 255], msg: "description mínimo 3 caracteres" },
      },
    },

    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      validate: {
        notNull: { msg: "content no puede estar vacío" },
        len: { args: [3, 255], msg: "content mínimo 3 caracteres" },
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "category no puede estar vacío" },
        len: { args: [3, 255], msg: "category mínimo 3 caracteres" },
      },
    },
    species: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "content no puede estar vacío" },
        len: { args: [3, 255], msg: "content mínimo 3 caracteres" },
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: { args: [3, 255], msg: "una url debe tener más de 3 caracteres" },
      },
    },
    references: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: { args: [3, 255], msg: "content mínimo 3 caracteres" },
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
    creator_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references:{
            model: 'users',
            key:'id'
        }
    }
  },
  {
    sequelize: db_connection, // ← tu conexión
    tableName: "articles",      // ← nombre real de la tabla
    timestamps: true,        // ← activa created/updated
    underscored: true,       // ← columnas snake_case
    createdAt: "created_at", // ← mapea el nombre
    updatedAt: "updated_at", // ← mapea el nombre
  }
);

// 7) ¡Exporto el modelo! (puedes default o nombrado)
export default Article;