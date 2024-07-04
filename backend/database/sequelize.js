import { Sequelize } from "sequelize";

const sequelize = new Sequelize("eywa_dev", "postgres", "password", {
  host: "localhost",
  dialect: "postgres",
  port: 5432,
  timezone: "+00:00", //UTC
});

export default sequelize;
