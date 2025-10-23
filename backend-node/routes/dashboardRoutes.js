import express from "express";
import db from "../config/db.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// === Overview ===
router.get("/overview", authenticate, async (req, res) => {
  try {
    const [[totalData]] = await db.query("SELECT COUNT(*) AS total FROM spis");
    const [[totalDraft]] = await db.query(
      "SELECT COUNT(*) AS total FROM spis WHERE status = 'draft'"
    );
    const [[totalApproval]] = await db.query(
      "SELECT COUNT(*) AS total FROM spis WHERE status = 'ready'"
    );

    res.json({
      totalData: totalData.total,
      totalDraft: totalDraft.total,
      totalApproval: totalApproval.total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil data overview" });
  }
});

// === Recent Data ===
router.get("/recent", authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT doc_no, part_number, status, created_by, date FROM spis ORDER BY created_at DESC LIMIT 10"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil data terbaru" });
  }
});

export default router;