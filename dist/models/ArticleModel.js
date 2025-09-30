// 1) Importo tipos y utilidades de Sequelize
import { DataTypes, Model } from "sequelize";
// 2) Importo mi conexión a la base de datos (tu Sequelize ya configurado)
import db_connection from "../database/db_connection.js";
// 5) Defino la clase del modelo (tipada)
export class Article extends Model {
    id;
    creator_id;
    title;
    description;
    content;
    category;
    species;
    image;
    references;
    created_at;
    updated_at;
}
// 6) Inicializo (equivalente a define) y mapeo columnas/validaciones
Article.init({
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
}, {
    sequelize: db_connection, // ← tu conexión
    tableName: "articles", // ← nombre real de la tabla
    timestamps: true, // ← activa created/updated
    underscored: true, // ← columnas snake_case
    createdAt: "created_at", // ← mapea el nombre
    updatedAt: "updated_at", // ← mapea el nombre
});
// 7) ¡Exporto el modelo! (puedes default o nombrado)
export default Article;
//# sourceMappingURL=ArticleModel.js.map