// import { Sequelize } from "sequelize";
// import dotenv from "dotenv";

// // 1) Cargar .env.test si estamos en test; si no, .env normal
// dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

// // 2) Bandera simple para saber si estamos en test
// const isTest = process.env.NODE_ENV === "test";

// // 3) Seguridad: en test, exige que la BD termine en _test
// if (isTest && process.env.DB_NAME && !process.env.DB_NAME.endsWith("_test")) {
//   throw new Error(`En test, DB_NAME debe terminar en "_test". Actual: ${process.env.DB_NAME}`);
// }

// // 4) Conexión
// const db_connection = new Sequelize(
//   process.env.DB_NAME as string,
//   process.env.DB_USER as string,
//   process.env.DB_PASS as string,
//   {
//     host: process.env.DB_HOST || "localhost",
//     dialect: "mysql",
//     logging: isTest ? false : console.log,
//     define: { timestamps: false },
//   }
// );

// export default db_connection;

// src/database/db_connection.ts
import { Sequelize } from "sequelize";
import fs from "fs";
import dotenv from "dotenv";

// 1) Cargar .env.test si estamos en test; si no, .env normal (opcional si ya te inyecta Docker)
dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

// 2) Bandera simple para saber si estamos en test
const isTest = process.env.NODE_ENV === "test";

// 3) Seguridad: en test, exige que la BD termine en _test
if (isTest && process.env.DB_NAME && !process.env.DB_NAME.endsWith("_test")) {
  throw new Error(
    `En test, DB_NAME debe terminar en "_test". Actual: ${process.env.DB_NAME}`
  );
}

// 4) TLS opcional
const sslEnabled = String(process.env.DB_SSL || "").toLowerCase() === "true";

let dialectOptions: any = {};
if (sslEnabled) {
  const caPath = process.env.DB_SSL_CA_PATH;        // p.ej. /app/certs/tidb-ca.pem en Docker
  const hasCA = caPath && fs.existsSync(caPath);
  const ca = hasCA ? fs.readFileSync(caPath, "utf8") : undefined;

  dialectOptions = ca
    ? { ssl: { ca, minVersion: "TLSv1.2", rejectUnauthorized: true } }
    : { ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true } };
}

// 5) Conexión Sequelize
const db_connection = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,      // local 3306; en TiDB pon 4000 por env
    dialect: "mysql",
    dialectOptions,                                  // activa TLS si DB_SSL=true
    logging: isTest ? false : console.log,
    define: { timestamps: false },
  }
);

export default db_connection;
