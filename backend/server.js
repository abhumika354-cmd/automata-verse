
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// Check backend
app.get("/", (req, res) => {
  res.json({ message: "AutomataVerse backend is running!" });
});

// Check database connection
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS connected");
    res.json({
      message: "Database connected successfully",
      database: rows[0].connected === 1 ? "Connected" : "Disconnected"
    });
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Get all challenges
app.get("/api/challenges", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM challenges ORDER BY id DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Challenges error:", error.message);
    res.status(500).json({ error: "Could not fetch challenges" });
  }
});

// Add a challenge
app.post("/api/challenges", async (req, res) => {
  try {
    const { title, challenge_type, description, difficulty } = req.body;

    if (!title || !challenge_type) {
      return res.status(400).json({
        error: "Title and challenge type are required"
      });
    }

    const [result] = await db.execute(
      `INSERT INTO challenges
       (title, challenge_type, description, difficulty)
       VALUES (?, ?, ?, ?)`,
      [
        title,
        challenge_type,
        description || null,
        difficulty || "Easy"
      ]
    );

    res.status(201).json({
      message: "Challenge added successfully",
      id: result.insertId
    });
  } catch (error) {
    console.error("Insert error:", error.message);
    res.status(500).json({ error: "Could not add challenge" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`AutomataVerse backend running on port ${PORT}`);
});
