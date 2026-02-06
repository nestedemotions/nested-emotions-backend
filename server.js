require("dotenv").config()
const express = require("express")
const { Pool } = require("pg")
const { v4: uuid } = require("uuid")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

app.get("/", (_, res) => {
  res.send("Nested Emotions backend live 🌿")
})

// USERS TABLE
pool.query(`
CREATE TABLE IF NOT EXISTS users (
 id UUID PRIMARY KEY,
 first_name TEXT,
 last_name TEXT,
 gender TEXT,
 email TEXT UNIQUE,
 phone TEXT UNIQUE,
 nickname TEXT,
 room TEXT,
 created_at TIMESTAMP DEFAULT NOW()
)
`)

// OTP TABLE
pool.query(`
CREATE TABLE IF NOT EXISTS otps (
 id UUID PRIMARY KEY,
 contact TEXT,
 code TEXT,
 expires TIMESTAMP
)
`)

// SIGNUP
app.post("/signup", async (req, res) => {
  const { firstName, lastName, gender, email, phone } = req.body
  const id = uuid()

  await pool.query(
    `INSERT INTO users (id, first_name, last_name, gender, email, phone)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [id, firstName, lastName, gender, email, phone]
  )

  res.json({ success: true, userId: id })
})

// ENTER ROOM
app.post("/enter-room", async (req, res) => {
  const { userId, nickname, room } = req.body

  await pool.query(
    `UPDATE users SET nickname=$1, room=$2 WHERE id=$3`,
    [nickname, room, userId]
  )

  res.json({ entered: true })
})

app.listen(process.env.PORT || 3000, () => {
  console.log("Nested Emotions backend running 🌙")
})
