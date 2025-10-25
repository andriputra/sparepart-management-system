import express from "express";
import db from "../config/db.js";

const router = express.Router();

// ✅ Save Final SPQS
router.post("/", async (req, res) => {
    try {
      const { user_id, spis_id, ...rest } = req.body;
  
      if (!user_id || !doc_no) {
        return res.status(400).json({ error: "user_id and doc_no are required" });
      }
  
      // Simpan data SPQS
      await db.query(
        "INSERT INTO spqs (user_id, data_json) VALUES (?, ?)",
        [user_id, JSON.stringify(rest)]
      );
  
      // ✅ Update progress_status ke completed di SPIS
      await db.query(
        "UPDATE spis SET progress_status = 'completed' WHERE id = ?",
        [spis_id]
      );
  
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

// === GET /api/spqs/next-docno ===
router.get("/next-docno", async (req, res) => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
  
      const [rows] = await db.query(
        "SELECT doc_no FROM spis WHERE doc_no LIKE ? ORDER BY id DESC LIMIT 1",
        [`IM/SPQS/${year}/${month}/%`]
      );
  
      let nextNumber = 1;
      if (rows.length > 0) {
        const lastDocNo = rows[0].doc_no;
        const parts = lastDocNo.split("/");
        const lastNumber = parseInt(parts[4], 10);
        nextNumber = lastNumber + 1;
      }
  
      const padded = String(nextNumber).padStart(5, "0");
      const nextDocNo = `IM/SPQS/${year}/${month}/${padded}`;
  
      res.json({ nextDocNo });
    } catch (err) {
      console.error("Error generating next doc number:", err);
      res.status(500).json({ error: "Failed to generate next doc_no" });
    }
});

export default router;