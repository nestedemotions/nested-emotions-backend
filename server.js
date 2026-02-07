const cors = require("cors");
const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(cors());


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS emotions (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

initDb().catch(console.error);

function validateEmotionText(text) {
  if (
    typeof text !== "string" ||
    text.trim().length === 0 ||
    text.length > 100
  ) {
    return "text must be a non-empty string under 100 characters";
  }

  return null;
}

app.get("/", (req, res) => {
  res.json({
    name: "Nested Emotions API",
    status: "running",
    endpoints: {
      health: "GET /health",
      getEmotions: "GET /emotions",
      addEmotion: "POST /emotions"
    }
  });
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "ok",
      db: "connected"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      db: "not connected"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.post("/emotions", async (req, res, next) => {
  try {
    const { text } = req.body;

    const error = validateEmotionText(text);
    if (error) {
      return res.status(400).json({ error });
    }

    const result = await pool.query(
      "INSERT INTO emotions (text) VALUES ($1) RETURNING *",
      [text]
    );

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.get("/emotions", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM emotions ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Global error handler (MUST be after routes)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

