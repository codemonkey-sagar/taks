import express from "express";
import crypto from "crypto";
import pool from "../db.js";
import { upload } from "../middleware.js";

const router = express.Router();

// Endpoint to get random questions
router.get("/questions", async (req, res) => {
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
router.post("/upload", upload.single("video"), async (req, res) => {
  if (!req.file || !req.body.questions) {
    return res.status(400).send("No file or questions provided.");
  }

  const videoBuffer = req.file.buffer;
  const hash = crypto.createHash("sha256").update(videoBuffer).digest("hex");
  const questions = req.body.questions;

  try {
    await pool.query(
      "INSERT INTO video_hashes (hash, questions) VALUES ($1, $2)",
      [hash, questions]
    );
    res.status(200).send("Video uploaded and hash saved.");
  } catch (error) {
    console.error("Error saving hash to database:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to save user role and wallet addresss
router.post("/save-role", async (req, res) => {
  const { walletAddress, role } = req.body;

  if (!walletAddress || !role) {
    return res
      .status(400)
      .json({ error: "Wallet address and role are required." });
  }

  try {
    await pool.query(
      "INSERT INTO roles (wallet_address, role) VALUES ($1, $2)",
      [walletAddress, role]
    );
    res.status(200).json({ message: "Role saved successfully." });
  } catch (error) {
    console.error("Error saving role to database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
