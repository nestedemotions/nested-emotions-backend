const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const createEmotionRoutes = require("./routes/emotions");

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

app.use("/emotions", createEmotionRoutes(pool));

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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

