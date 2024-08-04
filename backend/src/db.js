import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  // eslint-disable-next-line no-undef
  user: process.env.DB_USER,
  // eslint-disable-next-line no-undef
  host: process.env.DB_HOST,
  // eslint-disable-next-line no-undef
  database: process.env.DB_DATABASE,
  // eslint-disable-next-line no-undef
  password: process.env.DB_PASSWORD,
  // eslint-disable-next-line no-undef
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);

  // eslint-disable-next-line no-undef
  process.exit(-1);
});

export default pool;
