import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// === REGISTER ===
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashed, role || "approval"]
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// === LOGIN ===
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(404).json({ error: "User not found" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "sparepart_secret_key",
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role, id: user.id, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;