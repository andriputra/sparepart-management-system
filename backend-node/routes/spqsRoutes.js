import express from "express";
import db from "../config/db.js";

const router = express.Router();

// ✅ Save Final SPQS
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    await db.query("INSERT INTO spqs (data_json) VALUES (?)", [
      JSON.stringify(data),
    ]);
    res.json({ message: "SPQS saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save SPQS" });
  }
});

// ✅ Save Draft
router.post("/save-draft", async (req, res) => {
  const { user_id, data } = req.body;
  try {
    await db.query("REPLACE INTO spqs_draft (user_id, data_json) VALUES (?, ?)", [
      user_id,
      JSON.stringify(data),
    ]);
    res.json({ message: "Draft saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save draft" });
  }
});

// ✅ Get Draft
router.get("/draft/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT data_json FROM spqs_draft WHERE user_id = ?",
      [user_id]
    );
    res.json(rows.length ? JSON.parse(rows[0].data_json) : null);
  } catch (err) {
    res.status(500).json({ error: "Failed to get draft" });
  }
});

export default router;