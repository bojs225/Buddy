import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PG_USER || "postgres",
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_DATABASE || "postgres",
  password: process.env.PG_PASSWORD || "password",
  port: parseInt(process.env.PG_PORT, 10) || 5432,
});

const connectDatabase = async () => {
  try {
    await pool.connect();
    console.log("PostgreSQL Connected");
  } catch (err) {
    console.error("Error connecting to PostgreSQL:", err.message);
    console.error(err.stack);
    process.exit(1);
  }
};

export { pool, connectDatabase };
