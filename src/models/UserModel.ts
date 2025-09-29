// 1) Importo tipos y utilidades de Sequelize
import { DataTypes, Model, Optional } from "sequelize";
// 2) Importo mi conexión a la base de datos (tu Sequelize ya configurado)
import db_connection from "../database/db_connection.js"

// 3) Declaro cómo es un usuario en la BD (TODOS los campos)
export interface UserAttributes {
  id: bigint;
  username: string;
  email: string;
  password: string;
  name: string;
  last_name: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

// 4) Campos opcionales AL CREAR (Sequelize los rellena solo)
export type UserCreationAttributes = Optional<
  UserAttributes,
  "id" | "created_at" | "updated_at"
>;

// 5) Defino la clase del modelo (tipada)
export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: bigint;
  public username!: string;
  public email!: string;
  public password!: string;
  public name!: string;
  public last_name!: string;
  public role!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

// 6) Inicializo (equivalente a define) y mapeo columnas/validaciones
User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "username no puede estar vacío" },
        len: { args: [2, 255], msg: "username mínimo 2 caracteres" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: "email no puede estar vacío" },
        isEmail: { msg: "email no es válido" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "password no puede estar vacío" },
        len: { args: [6, 255], msg: "password mínimo 6 caracteres" },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
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
    tableName: "users",      // ← nombre real de la tabla
    timestamps: true,        // ← activa created/updated
    underscored: true,       // ← columnas snake_case
    createdAt: "created_at", // ← mapea el nombre
    updatedAt: "updated_at", // ← mapea el nombre
  }
);

// 7) ¡Exporto el modelo! (puedes default o nombrado)
export default User;

