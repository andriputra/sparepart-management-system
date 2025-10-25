import express from "express";
import multer from "multer";
import db from "../config/db.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ✅ Save final SPPS
router.post(
    "/",
    upload.fields([
      { name: "illustration_part" },
      { name: "illustration_package" },
    ]),
    async (req, res) => {
      try {
        const fields = req.body;
        const { user_id, spis_id } = fields;
  
        // Simpan data SPPS
        await db.query("INSERT INTO spps SET ?", [fields]);
  
        // ✅ Update progress di tabel SPIS
        await db.query(
            "UPDATE spis SET progress_status = 'step2' WHERE id = ?",
            [spis_id]
        );
  
        res.json({ message: "SPPS saved successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to save SPPS" });
      }
    }
);

router.get("/next-docno", async (req, res) => {
    const conn = await db.getConnection();
    await conn.beginTransaction();
  
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
  
      // Lock data terakhir
      const [rows] = await conn.query(
        "SELECT doc_no FROM spps WHERE doc_no LIKE ? ORDER BY id DESC LIMIT 1 FOR UPDATE",
        [`IM/SPPS/${year}/${month}/%`]
      );
  
      let nextNumber = 1;
      if (rows.length > 0) {
        const lastDocNo = rows[0].doc_no;
        const parts = lastDocNo.split("/");
        const lastNumber = parseInt(parts[4], 10);
        nextNumber = lastNumber + 1;
      }
  
      const padded = String(nextNumber).padStart(5, "0");
      const nextDocNo = `IM/SPPS/${year}/${month}/${padded}`;
  
      // ✅ Sisipkan catatan dummy agar nomor "dianggap terpakai"
      await conn.query(
        "INSERT INTO spps (doc_no, date, created_by) VALUES (?, NOW(), 'SYSTEM_RESERVED')",
        [nextDocNo]
      );
  
      await conn.commit();
      conn.release();
  
      res.json({ nextDocNo });
    } catch (err) {
      await conn.rollback();
      conn.release();
      console.error("Error generating next doc number:", err);
      res.status(500).json({ error: "Failed to generate next doc_no" });
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