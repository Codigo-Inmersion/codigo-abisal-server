import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// 1) Cargar .env.test si estamos en test; si no, .env normal
dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

// 2) Bandera simple para saber si estamos en test
const isTest = process.env.NODE_ENV === "test";

// 3) Seguridad: en test, exige que la BD termine en _test
if (isTest && process.env.DB_NAME && !process.env.DB_NAME.endsWith("_test")) {
  throw new Error(`En test, DB_NAME debe terminar en "_test". Actual: ${process.env.DB_NAME}`);
}

// 4) Conexión
const db_connection = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: isTest ? false : console.log,
    define: { timestamps: false },
  }
);

export default db_connection;
