import express from "express";
import db from "../config/db.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// === Overview ===
router.get("/overview", authenticate, async (req, res) => {
  try {
    const [[totalData]] = await db.query("SELECT COUNT(*) AS total FROM spis WHERE status != 'draft'");
    const [[totalDraft]] = await db.query(
      "SELECT COUNT(*) AS total FROM spis WHERE status = 'submitted' AND progress_status = 'step2'"
    );
    const [[totalSubmitted]] = await db.query(
      "SELECT COUNT(*) AS total FROM spis WHERE status = 'submitted' AND progress_status = 'completed'"
    );
    const [[totalApproved]] = await db.query(
      "SELECT COUNT(*) AS total FROM spis WHERE status = 'completed'"
    );

    res.json({
      totalData: totalData.total,
      totalDraft: totalDraft.total,
      totalApproval: totalSubmitted.total, 
      totalApproved: totalApproved.total, 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil data overview" });
  }
});

// === Recent Data ===
router.get("/recent", authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT doc_no, part_number, 
             CASE 
               WHEN status = 'submitted' AND progress_status = 'completed' THEN 'Siap Approval'
               WHEN status = 'completed' AND progress_status = 'completed' THEN 'Approved'
               ELSE status
             END AS status,
             created_by, date, created_at
      FROM spis
      UNION ALL
      SELECT doc_no, part_number, status, created_by, date, created_at FROM spps
      UNION ALL
      SELECT doc_no, part_number, status, created_by, date, created_at FROM spqs
      ORDER BY created_at DESC
      LIMIT 20
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil data terbaru" });
  }
});

export default router;