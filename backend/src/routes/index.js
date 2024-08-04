import express from "express";
import pool from "../db.js";

const router = express.Router();
console.log("hiii...........");

// router.post("/save-role", async (req, res) => {
//   const { walletAddress, role } = req.body;

//   if (!walletAddress || !role) {
//     return res
//       .status(400)
//       .json({ error: "Wallet address and role are required." });
//   }

//   try {
//     // Check if the address already exists
//     const result = await pool.query(
//       "SELECT role FROM roles WHERE wallet_address = $1",
//       [walletAddress]
//     );

//     if (result.rows.length > 0) {
//       // If the address exists, return a message indicating the role and walletAddress
//       return res.status(200).json({
//         message: `Address ${walletAddress} is already joined as ${result.rows[0].role}.`,
//         alreadyJoined: true, // This property indicates that the role already exists
//         role: result.rows[0].role,
//       });
//     } else {
//       // If the address does not exist, insert it into the database
//       await pool.query(
//         "INSERT INTO roles (wallet_address, role) VALUES ($1, $2)",
//         [walletAddress, role]
//       );
//       return res.status(200).json({
//         message: "Role saved successfully.",
//         alreadyJoined: false, // This property indicates that the role is newly saved
//         role: role, // Include the role to maintain consistency
//       });
//     }
//   } catch (error) {
//     console.error("Error saving role to database:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

export default router;
