process.env.NODE_ENV = "test";

//  Cargo variables de .env.test
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

// Importo conexión y MODELOS (¡importar los modelos es clave!)
import db_connection from "../src/database/db_connection.js";



//  Antes de todo: conectar y crear tablas desde modelos
beforeAll(async () => {
  await db_connection.authenticate();
  await db_connection.sync({ force: true }); // borra si hay y recrea limpio para test
});

//  Después de todo: cerrar conexión
afterAll(async () => {
  await db_connection.close();
});
