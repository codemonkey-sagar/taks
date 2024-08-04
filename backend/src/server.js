import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer, { memoryStorage } from "multer";
import fetch from "node-fetch";
import { createHash } from "crypto";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 3001;

// PostgreSQL connection
const pool = new Pool({
  user: "everest",
  host: "dpg-cqj92ruehbks73c8559g-a.oregon-postgres.render.com",
  database: "eth_kmqr",
  password: "RlPomw3oErXYYuwgBbhDoP6cuy7hjzX2",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json());

const storage = memoryStorage();
const upload = multer({ storage: storage });

// Endpoint to verify reCAPTCHA
app.post("/verify-recaptcha", async (req, res) => {
  const { token, version } = req.body;
  const secretKey =
    version === "v3" ? RECAPTCHA_SECRET_V3 : RECAPTCHA_SECRET_V2;

  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${secretKey}&response=${token}`,
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to verify reCAPTCHA" });
  }
});

// Endpoint to get random questions
app.get("/questions", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT question FROM questions ORDER BY RANDOM() LIMIT 10"
    );
    const questions = result.rows.map((row) => row.question);
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions from database:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to upload video and save hash
app.post("/upload", upload.single("video"), async (req, res) => {
  if (!req.file || !req.body.question) {
    return res.status(400).send("No file or question provided.");
  }

  const videoBuffer = req.file.buffer;
  const hash = createHash("sha256").update(videoBuffer).digest("hex");
  const question = req.body.question;

  try {
    await pool.query(
      "INSERT INTO video_hashes (hash, question) VALUES ($1, $2)",
      [hash, question]
    );
    res.status(200).send("Video uploaded and hash saved.");
  } catch (error) {
    console.error("Error saving hash to database:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to save user role and wallet address
// Endpoint to save user role and wallet address
app.post("/api/save-role", async (req, res) => {
  const { walletAddress, role } = req.body;

  if (!walletAddress || !role) {
    return res
      .status(400)
      .json({ error: "Wallet address and role are required." });
  }

  try {
    // Check if the address already exists
    const result = await pool.query(
      "SELECT role FROM roles WHERE wallet_address = $1",
      [walletAddress]
    );

    if (result.rows.length > 0) {
      // If the address exists, return a message indicating the role and walletAddress
      return res.status(200).json({
        message: `Address ${walletAddress} is already joined as ${result.rows[0].role}.`,
        alreadyJoined: true,
        role: result.rows[0].role,
      });
    } else {
      // If the address does not exist, insert it into the database
      await pool.query(
        "INSERT INTO roles (wallet_address, role) VALUES ($1, $2)",
        [walletAddress, role]
      );
      return res.status(200).json({
        message: "Role saved successfully.",
        alreadyJoined: false,
        walletAddress,
        role,
      });
    }
  } catch (error) {
    console.error("Error saving role to database:", error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
