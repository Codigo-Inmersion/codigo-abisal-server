// src/database/db_connection.ts

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Si el entorno es 'test', carga las variables de .env.test
// De lo contrario, carga las de .env (comportamiento por defecto)
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

const db_connection = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    // Opcional: Desactiva los logs de SQL cuando se ejecutan los tests
    logging: process.env.NODE_ENV === 'test' ? false : console.log,
    define: {
      timestamps: false,
    },
  }
);

export default db_connection;