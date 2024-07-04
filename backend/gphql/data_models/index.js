import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import UserModel from "./user_model.js";
import TransactionModel from "./transaction_model.js";

dotenv.config();

console.log("PG_USER:", process.env.PG_USER);
console.log("PG_PASSWORD:", process.env.PG_PASSWORD);
console.log("PG_HOST:", process.env.PG_HOST);
console.log("PG_DATABASE:", process.env.PG_DATABASE);
console.log("PG_PORT:", process.env.PG_PORT);

const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    dialect: "postgres",
    port: process.env.PG_PORT,
  }
);

const models = {
  User: UserModel(sequelize),
  Transaction: TransactionModel(sequelize),
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
