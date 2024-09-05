import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
async function seed() {
  const query = `INSERT INTO messages (name, message, likes) VALUES($1, $2, $3)`;
  const result = await db.query(query, ["Luigi", "Lets a go", 2]);
}
seed();
