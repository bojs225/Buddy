import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const { PG_USER, PG_PASSWORD, PG_HOST, PG_DATABASE, PG_PORT } = process.env;

console.log("PG_USER:", PG_USER);
console.log("PG_PASSWORD:", PG_PASSWORD);
console.log("PG_HOST:", PG_HOST);
console.log("PG_DATABASE:", PG_DATABASE);
console.log("PG_PORT:", PG_PORT);

const sequelize = new Sequelize(PG_DATABASE, PG_USER, PG_PASSWORD, {
  host: PG_HOST,
  port: PG_PORT,
  dialect: "postgres",
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
})();
