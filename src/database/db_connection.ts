import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

if (process.env.NODE_ENV === 'test') {
  // Si estamos en "test", carga el archivo .env.test
  dotenv.config({ path: '.env.test' });
} else {
  // Para cualquier otro caso (desarrollo, producción), carga .env
  dotenv.config();
}

const db_connection = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: "localhost",
    dialect: "mysql",
    logging: process.env.NODE_ENV === 'test' ? false : console.log,
    define: {
      timestamps: false, //esta parte es un añadido por lo de createAT y updateAt
    },
  }
);

export default db_connection;
