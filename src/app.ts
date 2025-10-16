// import express from "express";
// import db_connection from "./database/db_connection.js";
// import "dotenv/config";
// import "./models/UserModel.js"; 
// import "./models/ArticleModel.js";
// import authRouter from "./routes/authRoutes.js";
// import articleRouter from "./routes/articleRoutes.js";
// import { User } from "./models/UserModel.js";
// import { Article } from "./models/ArticleModel.js";
// import passwordResetRouter from "./routes/passwordReset.routes.js";
// import "./models/PasswordResetToken.js";
// import cors from "cors";
// import userRouter from "./routes/userRoutes.js"; // 👈 el nuevo archivo


// User.hasMany(Article, { foreignKey: 'creator_id' });
// Article.belongsTo(User, { foreignKey: 'creator_id' });

//  export const app = express();
// const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;
//  app.use(cors({ origin: process.env.CORS_ORIGIN || "*" })); // puerto de Vite
//  app.use(express.json());
//  app.get("/", (_req, res) => {
//   res.send("Hola API");
// });
// app.get("/healthz", (_req, res) => {
//   res.status(200).send("ok");
// });
// app.use("/auth", authRouter )
// app.use("/article", articleRouter)
// app.use("/users", userRouter);
// app.use("/auth", passwordResetRouter);

// // await db_connection.sync({ alter: true }); // o { force: true } si quieres regenerar

// async function startServer() {
//   try {
//     // Sincroniza los modelos con la base de datos
//     await db_connection.sync(); 
//         console.log("✅ Database synchronized successfully.");

//     app.listen(PORT, () => {
//       console.log(`🚀 Server is running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error("❌ Unable to sync database:", error);
//   }
// }

// if (process.env.NODE_ENV !== 'test') {
//   startServer();
// }

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// ✅ 1) Cargar .env SOLO en desarrollo (en Render ya usas el panel de variables)
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import db_connection from "./database/db_connection.js";
import "./models/UserModel.js";
import "./models/ArticleModel.js";
import { User } from "./models/UserModel.js";
import { Article } from "./models/ArticleModel.js";
import "./models/PasswordResetToken.js";
import authRouter from "./routes/authRoutes.js";
import articleRouter from "./routes/articleRoutes.js";
import userRouter from "./routes/userRoutes.js";
import passwordResetRouter from "./routes/passwordReset.routes.js";

// Relaciones
User.hasMany(Article, { foreignKey: "creator_id" });
Article.belongsTo(User, { foreignKey: "creator_id" });

export const app = express();

// ✅ 2) PORT: usa el dinámico de Render si existe; 8000 en local
const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

// ✅ 3) CORS con **lista** de orígenes (soporta uno o varios desde la env)
//    Ejemplos de CORS_ORIGIN:
//    - Solo prod:  "https://codigo-abisal-client.vercel.app"
//    - Prod + local: "https://codigo-abisal-client.vercel.app,http://localhost:5174"
const rawOrigins = process.env.CORS_ORIGIN || "";
const whitelist = rawOrigins
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

// ⚠️ IMPORTANTE: deja SOLO este middleware de CORS (no dupliques otro en otro archivo)
app.use(
  cors({
    origin: (origin, callback) => {
      // Peticiones sin "Origin" (curl/healthz) → permite
      if (!origin) return callback(null, true);

      // Si no configuraste nada, permite todo (cámbialo a false si quieres bloquear por defecto)
      if (whitelist.length === 0) return callback(null, true);

      // Permite si el origin está en la lista
      if (whitelist.includes(origin)) return callback(null, true);

      // Origen no permitido
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // déjalo true solo si usas cookies/autenticación con credenciales
  })
);

// Body parser
app.use(express.json());

// Rutas
app.get("/", (_req, res) => {
  res.send("Hola API");
});

// Healthcheck para Render
app.get("/healthz", (_req, res) => res.status(200).send("ok"));

app.use("/auth", authRouter);
app.use("/article", articleRouter);
app.use("/users", userRouter);
app.use("/auth", passwordResetRouter);

// Arranque
async function startServer() {
  try {
    await db_connection.sync();
    console.log("✅ Database synchronized successfully.");

    // ✅ 4) Escucha en 0.0.0.0 (necesario en Render) y en el PORT correcto
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log("CORS_ORIGIN =", process.env.CORS_ORIGIN || "(no configurado)");
    });
  } catch (error) {
    console.error("❌ Unable to sync database:", error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== "test") {
  startServer();
}
