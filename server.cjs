const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const { Pool } = require("pg");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "collaborative_notes",
  password: "postgres",
  port: 5432,
});

pool.query(`
  CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);
// -- Insert 50 records
// DO $$
// BEGIN
//   FOR i IN 1..50 LOOP
//     INSERT INTO notes (title, content)
//     VALUES
//     (
//       CONCAT('Note ', i),
//       CONCAT('This is the content for note number ', i, '. This note was automatically generated as part of a batch insert.'),
//     );
//   END LOOP;
// END $$;
// Get all notes
app.get("/api/notes", async (req, res) => {
  const { limit = 10, offset = 0 } = req.query;
  try {
    const result = await pool.query(
      "SELECT * FROM notes ORDER BY id ASC LIMIT $1 OFFSET $2",
      [parseInt(limit), parseInt(offset)]
    );

    const totalCountResult = await pool.query("SELECT COUNT(*) FROM notes");
    const totalCount = totalCountResult.rows[0].count;

    res.json({ notes: result.rows, totalCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching notes" });
  }
});

// Get a single note by ID
app.get("/api/notes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM notes WHERE id = $1", [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Note not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching the note" });
  }
});

// Create a new note
app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *",
      [title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating the note" });
  }
});

// Update a note
app.put("/api/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      "UPDATE notes SET title = $1, content = $2, timestamp = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
      [title, content, id]
    );
    if (result.rows.length > 0) {
      const updatedNote = result.rows[0];
      res.json(updatedNote);
    } else {
      res.status(404).json({ message: "Note not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating the note" });
  }
});

// Delete a note
app.delete("/api/notes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM notes WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Note not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting the note" });
  }
});

// Real-Time Collaboration with Socket.IO

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a specific note room
  socket.on("join-note", (noteId) => {
    socket.join(noteId);
    console.log(`User ${socket.id} joined note ${noteId}`);
  });

  socket.on("update-note", async ({ noteId, content }) => {
    console.log(`User ${socket.id} updated note ${noteId}`);
    try {
      socket.to(noteId).emit("receive-update", {
        noteId,
        content,
      });
    } catch (err) {
      console.error("Error updating note in real-time:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start the server
const PORT = 5200;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
