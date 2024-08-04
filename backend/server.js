import express from "express";
import bodyParser from "body-parser";
import multer, { memoryStorage } from "multer";
import fetch from "node-fetch";
import { createHash } from "crypto";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001;

const RECAPTCHA_SECRET_V3 = "YOUR_RECAPTCHA_V3_SECRET_KEY";
const RECAPTCHA_SECRET_V2 = "YOUR_RECAPTCHA_V2_SECRET_KEY";

// PostgreSQL connection
const pool = new Pool({
  user: "everest",
  host: "dpg-cqj92ruehbks73c8559g-a.oregon-postgres.render.com",
  database: "eth_kmqr",
  password: "RlPomw3oErXYYuwgBbhDoP6cuy7hjzX2",
  port: 5432,
});

// Middleware
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
