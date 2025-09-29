import express from "express";
import db_connection from "../src/database/db_connection.js";
import "dotenv/config";
import "./models/UserModel"; 
import "./models/ArticleModel";


 export const app = express();
 const PORT = process.env.PORT || 8080;

 app.use(express.json());
 app.get("/", (_req, res) => {
  res.send("Hola API");
});

async function startServer() {
  try {
    // Sincroniza los modelos con la base de datos
    await db_connection.sync(); // OJO: Ver las opciones más abajo
    console.log("✅ Database synchronized successfully.");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to sync database:", error);
  }
}

startServer();