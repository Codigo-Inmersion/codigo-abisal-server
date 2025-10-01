// tests/setup-db.ts
import db from "../src/database/db_connection";

export async function setupDB() {
  // Crea tablas para tests (en limpio)
  await db.sync({ force: true });
}

export async function closeDB() {
  await db.close();
}
