
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const app = express();

// Allowed frontend websites
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
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

const smtpPort = Number(process.env.SMTP_PORT || 587);
const emailTransport =
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASSWORD &&
  Number.isInteger(smtpPort) &&
  smtpPort > 0 &&
  smtpPort <= 65535
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: smtpPort,
        secure:
          process.env.SMTP_SECURE === "true" ||
          (!process.env.SMTP_SECURE && smtpPort === 465),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })
    : null;
const notificationFrontendUrl =
  (process.env.FRONTEND_URL || "https://automata-verse.netlify.app").replace(
    /\/+$/,
    ""
  );
let notificationTableReady;
let reminderCheckRunning = false;

async function ensureNotificationPreferencesTable() {
  if (!notificationTableReady) {
    notificationTableReady = db
      .query(`CREATE TABLE IF NOT EXISTS notification_preferences (
        user_id BIGINT NOT NULL PRIMARY KEY,
        daily_email_enabled BOOLEAN NOT NULL DEFAULT FALSE,
        reminder_timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
        last_reminder_sent_date DATE NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP
      )`)
      .catch((error) => {
        notificationTableReady = undefined;
        throw error;
      });
  }

  await notificationTableReady;
}

function requireAuthenticatedUser(req, res, next) {
  const authorization = req.get("authorization") || "";
  const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);

  if (!tokenMatch) {
    return res.status(401).json({ error: "Authentication is required" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: "Authentication is not configured" });
  }

  try {
    req.authenticatedUser = jwt.verify(tokenMatch[1], process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "Your session is invalid or expired" });
  }

  if (!req.authenticatedUser.id) {
    return res.status(401).json({ error: "Your session is invalid" });
  }

  return next();
}

function getLocalDateTime(timeZone, date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map(({ type, value }) => [type, value])
  );

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    hour: Number(parts.hour),
  };
}

async function sendScheduledEmailReminders() {
  if (!emailTransport || reminderCheckRunning) {
    return;
  }

  reminderCheckRunning = true;

  try {
    await ensureNotificationPreferencesTable();
    const [users] = await db.query(
      `SELECT preferences.user_id, preferences.reminder_timezone,
              users.name, users.email
       FROM notification_preferences AS preferences
       JOIN users ON users.id = preferences.user_id
       WHERE preferences.daily_email_enabled = TRUE`
    );
    const now = new Date();

    for (const user of users) {
      let localDateTime;

      try {
        localDateTime = getLocalDateTime(user.reminder_timezone, now);
      } catch (error) {
        console.error(
          `Invalid reminder timezone for user ${user.user_id}:`,
          error.message
        );
        continue;
      }

      if (localDateTime.hour !== 9) {
        continue;
      }

      const [claim] = await db.execute(
        `UPDATE notification_preferences
         SET last_reminder_sent_date = ?
         WHERE user_id = ?
           AND daily_email_enabled = TRUE
           AND (
             last_reminder_sent_date IS NULL
             OR last_reminder_sent_date < ?
           )`,
        [localDateTime.date, user.user_id, localDateTime.date]
      );

      if (claim.affectedRows !== 1) {
        continue;
      }

      const name = typeof user.name === "string" ? user.name.trim() : "";
      const firstName = name.split(/\s+/)[0] || "there";

      try {
        await emailTransport.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: user.email,
          subject: "Your AutomataVerse lesson is waiting for you",
          text: `Hi ${firstName},\n\nYour next AutomataVerse lesson is waiting for you. Take a few minutes to continue your learning journey:\n\n${notificationFrontendUrl}/learn\n\nYou can turn off daily email reminders anytime in Settings.`,
        });
      } catch (error) {
        console.error(
          `Could not send lesson reminder to user ${user.user_id}:`,
          error
        );

        try {
          await db.execute(
            `UPDATE notification_preferences
             SET last_reminder_sent_date = NULL
             WHERE user_id = ? AND last_reminder_sent_date = ?`,
            [user.user_id, localDateTime.date]
          );
        } catch (resetError) {
          console.error(
            `Could not release reminder claim for user ${user.user_id}:`,
            resetError
          );
        }
      }
    }
  } catch (error) {
    console.error("Daily email reminder check failed:", error);
  } finally {
    reminderCheckRunning = false;
  }
}

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
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find the account using its email
    const [users] = await db.execute(
      "SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1",
      [cleanEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = users[0];

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
        error: "Invalid email or password",
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

app.get(
  "/api/notifications/preferences",
  requireAuthenticatedUser,
  async (req, res) => {
    try {
      await ensureNotificationPreferencesTable();
      const [rows] = await db.execute(
        `SELECT daily_email_enabled, reminder_timezone
         FROM notification_preferences
         WHERE user_id = ?
         LIMIT 1`,
        [req.authenticatedUser.id]
      );
      const preferences = rows[0];

      return res.json({
        dailyReminder: Boolean(preferences?.daily_email_enabled),
        timezone: preferences?.reminder_timezone || "UTC",
        emailDeliveryAvailable: Boolean(emailTransport),
      });
    } catch (error) {
      console.error("Notification preference lookup failed:", error);

      return res.status(500).json({
        error: "Could not load notification preferences",
      });
    }
  }
);

app.put(
  "/api/notifications/preferences",
  requireAuthenticatedUser,
  async (req, res) => {
    const { dailyReminder, timezone } = req.body || {};

    if (
      typeof dailyReminder !== "boolean" ||
      typeof timezone !== "string" ||
      !timezone.trim() ||
      timezone.length > 64
    ) {
      return res.status(400).json({
        error: "A reminder preference and valid timezone are required",
      });
    }

    try {
      new Intl.DateTimeFormat("en-US", { timeZone: timezone }).format();
    } catch {
      return res.status(400).json({ error: "The timezone is invalid" });
    }

    if (dailyReminder && !emailTransport) {
      return res.status(503).json({
        error: "Email reminders are not configured on the server yet",
      });
    }

    try {
      await ensureNotificationPreferencesTable();
      await db.execute(
        `INSERT INTO notification_preferences
          (user_id, daily_email_enabled, reminder_timezone)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE
          daily_email_enabled = VALUES(daily_email_enabled),
          reminder_timezone = VALUES(reminder_timezone),
          last_reminder_sent_date = IF(
            VALUES(daily_email_enabled) = FALSE,
            NULL,
            last_reminder_sent_date
          )`,
        [req.authenticatedUser.id, dailyReminder, timezone]
      );

      return res.json({
        dailyReminder,
        timezone,
        emailDeliveryAvailable: Boolean(emailTransport),
      });
    } catch (error) {
      console.error("Notification preference update failed:", error);

      return res.status(500).json({
        error: "Could not save notification preferences",
      });
    }
  }
);

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

  if (emailTransport) {
    void sendScheduledEmailReminders();
    setInterval(() => {
      void sendScheduledEmailReminders();
    }, 5 * 60 * 1000);
  } else {
    console.warn(
      "Email reminders are disabled. Configure SMTP_HOST, SMTP_USER, and SMTP_PASSWORD to enable them."
    );
  }
});
