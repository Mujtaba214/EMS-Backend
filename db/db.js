import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Client({
  connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false },
});

db.connect();

db.on("error", (err) => {
  console.error("Unexpected error while connecting db", err);
});

export const query = (text, params) => db.query(text, params);
