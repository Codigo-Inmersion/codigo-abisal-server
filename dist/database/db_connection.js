import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const db_connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: "localhost",
    dialect: "mysql",
    define: {
        timestamps: false, //esta parte es un añadido por lo de createAT y updateAt
    },
});
export default db_connection;
//# sourceMappingURL=db_connection.js.map