import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();

app.use(express.json());
app.use(cors());

dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/", function (request, response) {
  response.json("This is my root route.");
});

app.get("/messages", async function (request, response) {
  const messages = await db.query("SELECT * FROM messages");
  response.json(messages.rows);
});

app.post("/messages", async function (request, response) {
  const name = request.body.name;
  const message = request.body.message;
  const newMessage = await db.query(
    "INSERT INTO messages (name, message, likes) VALUES ($1, $2, $3)",
    [name, message, 0]
  );
  response.json(newMessage.rows[0]);
});
app.post("/messages/:id/like", async function (request, response) {
  const messageId = request.params.id;
  {
    const updatedMessage = await db.query(
      "UPDATE messages SET likes = likes + 1 where id = $1",
      [messageId]
    );
    response.json(updatedMessage.rows[0]);
  }
});
app.delete("/messages/:id", async function (request, response) {
  const messageId = request.params.id;
  console.log("Deleting message with ID:", messageId);

  const deleteResult = await db.query(
    "DELETE FROM messages WHERE id = $1 RETURNING *",
    [messageId]
  );

  console.log("Delete result:", deleteResult);

  if (deleteResult.rowCount === 0) {
    return response.status(404).json({ error: "Message not found" });
  }

  response.json({ success: true, message: "Message deleted" });
});

app.listen(8080, function () {
  console.log("App is running at render.com");
});
