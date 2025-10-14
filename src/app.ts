import express from "express";
import db_connection from "./database/db_connection.js";
import "dotenv/config";
import "./models/UserModel.js"; 
import "./models/ArticleModel.js";
import authRouter from "./routes/authRoutes.js";
import articleRouter from "./routes/articleRoutes.js";
import { User } from "./models/UserModel.js";
import { Article } from "./models/ArticleModel.js";
import passwordResetRouter from "./routes/passwordReset.routes.js";
import "./models/PasswordResetToken.js";
import cors from "cors";
import userRouter from "./routes/userRoutes.js"; // 👈 el nuevo archivo


User.hasMany(Article, { foreignKey: 'creator_id' });
Article.belongsTo(User, { foreignKey: 'creator_id' });

 export const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;
 app.use(cors({ origin: process.env.CORS_ORIGIN || "*" })); // puerto de Vite
 app.use(express.json());
 app.get("/", (_req, res) => {
  res.send("Hola API");
});
app.get("/healthz", (_req, res) => {
  res.status(200).send("ok");
});
app.use("/auth", authRouter )
app.use("/article", articleRouter)
app.use("/users", userRouter);
app.use("/auth", passwordResetRouter);

// await db_connection.sync({ alter: true }); // o { force: true } si quieres regenerar

async function startServer() {
  try {
    // Sincroniza los modelos con la base de datos
    await db_connection.sync(); 
        console.log("✅ Database synchronized successfully.");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to sync database:", error);
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
