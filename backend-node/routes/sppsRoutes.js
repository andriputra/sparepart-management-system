import express from "express";
import multer from "multer";
import db from "../config/db.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ✅ Save final SPPS
router.post("/", upload.fields([
  { name: "illustration_part" },
  { name: "illustration_package" },
]), async (req, res) => {
  try {
    const fields = req.body;
    await db.query("INSERT INTO spps SET ?", [fields]);
    res.json({ message: "SPPS saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save SPPS" });
  }
});

// ✅ Save draft
router.post("/save-draft", async (req, res) => {
  const { user_id, data } = req.body;
  try {
    await db.query("REPLACE INTO spps_draft (user_id, data_json) VALUES (?, ?)", [
      user_id,
      JSON.stringify(data),
    ]);
    res.json({ message: "Draft saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save draft" });
  }
});

// ✅ Get draft
router.get("/draft/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT data_json FROM spps_draft WHERE user_id = ?",
      [user_id]
    );
    res.json(rows.length ? JSON.parse(rows[0].data_json) : null);
  } catch (err) {
    res.status(500).json({ error: "Failed to get draft" });
  }
});

export default router;