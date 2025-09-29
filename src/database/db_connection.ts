import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db_connection = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: "localhost",
    dialect: "mysql",
    define: {
      timestamps: false, //esta parte es un añadido por lo de createAT y updateAt
    },
  }
);

export default db_connection;