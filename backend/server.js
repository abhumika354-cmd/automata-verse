
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// Allowed frontend websites
const allowedOrigins = [
  "http://localhost:5173",
  "https://automata-verse.netlify.app",
  "https://automata-verse-frontend.onrender.com",
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without an Origin header, such as health checks.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("Blocked by CORS. Request origin:", origin);
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

// TiDB Cloud database connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 4000),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    minVersion: "TLSv1.2",
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Backend status
app.get("/", (req, res) => {
  res.json({
    message: "AutomataVerse backend is running!",
  });
});

// Database health check
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS connected");

    return res.json({
      message: "Database connected successfully",
      database: rows[0].connected === 1 ? "Connected" : "Disconnected",
    });
  } catch (error) {
    console.error("Database error:", error.message);

    return res.status(500).json({
      error: "Database connection failed",
    });
  }
});

// Register a new user
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        error: "Name, email and password are required",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || password.length < 8) {
      return res.status(400).json({
        error: "Enter valid details and a password of at least 8 characters",
      });
    }

    const [existingUsers] = await db.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [cleanEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        error: "An account with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [result] = await db.execute(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [cleanName, cleanEmail, passwordHash]
    );

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: result.insertId,
        name: cleanName,
        email: cleanEmail,
      },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        error: "An account with this email already exists",
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      error: "Registration failed",
    });
  }
});

// Login an existing user
app.post("/api/auth/login", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        error: "Name, email and password are required",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Find the account using its email
    const [users] = await db.execute(
      "SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1",
      [cleanEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        error: "Invalid name, email or password",
      });
    }

    const user = users[0];

    // The entered name must match the registered account
    if (user.name.trim().toLowerCase() !== cleanName.toLowerCase()) {
      return res.status(401).json({
        error: "Invalid name, email or password",
      });
    }

    // Verify the saved password hash
    if (
      typeof user.password_hash !== "string" ||
      !user.password_hash.startsWith("$2")
    ) {
      console.error("Stored password hash is invalid for user ID:", user.id);

      return res.status(500).json({
        error: "Account password data is invalid. Please register again or contact support.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid name, email or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");

      return res.status(500).json({
        error: "Authentication is not configured",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      error: "Login failed",
    });
  }
});

// Get all challenges
app.get("/api/challenges", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM challenges ORDER BY id DESC"
    );

    return res.json(rows);
  } catch (error) {
    console.error("Challenges error:", error);

    return res.status(500).json({
      error: "Could not fetch challenges",
    });
  }
});

// Add a challenge
app.post("/api/challenges", async (req, res) => {
  try {
    const {
      title,
      challenge_type,
      description,
      difficulty,
    } = req.body || {};

    if (!title || !challenge_type) {
      return res.status(400).json({
        error: "Title and challenge type are required",
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
        difficulty || "Easy",
      ]
    );

    return res.status(201).json({
      message: "Challenge added successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Insert error:", error);

    return res.status(500).json({
      error: "Could not add challenge",
    });
  }
});

// Handle unexpected errors
app.use((error, req, res, next) => {
  console.error("Server error:", error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    error: "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AutomataVerse backend running on port ${PORT}`);
});
