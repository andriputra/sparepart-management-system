import express from "express";
import db from "../config/db.js"; 
import path from "path";
import fs from "fs";

const router = express.Router();

// ✅ GET semua dokumen SPAREPART
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
        SELECT 
            spis.id,
            spis.doc_no,
            spis.name,
            spis.status,
            spis.progress_status,
            spis.updated_at
        FROM spis
        ORDER BY spis.updated_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching spareparts:", err);
    res.status(500).json({ error: "Failed to fetch spareparts" });
  }
});

// ✅ GET generate PDF (gabungan 3 file SPIS, SPPS, SPQS)
router.get("/:id/generate-pdf", async (req, res) => {
  const { id } = req.params;

  try {
    // Ambil data dokumen berdasarkan id
    const [[spis]] = await db.query("SELECT * FROM spis WHERE id = ?", [id]);
    const [[spps]] = await db.query("SELECT * FROM spps WHERE spis_id = ?", [id]);
    const [[spqs]] = await db.query("SELECT * FROM spqs WHERE spis_id = ?", [id]);

    if (!spis) {
      return res.status(404).json({ error: "Dokumen tidak ditemukan" });
    }

    // 🔧 Di sini kamu bisa generate PDF pakai reportlab / pdfkit / pdfmake
    // Untuk sekarang kirim dummy file PDF biar FE bisa download
    const pdfPath = path.join("uploads", "dummy.pdf");
    if (!fs.existsSync(pdfPath)) {
      fs.writeFileSync(pdfPath, "PDF Placeholder untuk SPIS-SPPS-SPQS");
    }

    res.download(pdfPath, `SPAREPART_${spis.doc_no}_ALL.pdf`);
  } catch (err) {
    console.error("Error generating PDF:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

export default router;