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

// ✅ GET gabungan SPIS, SPPS, SPQS per dokumen (untuk tampilan list)
router.get("/with-documents", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.id AS spis_id,
        s.doc_no,
        s.part_number,
        s.name AS created_by,
        s.approved_by,
        s.status AS spis_status,
        COALESCE(MAX(p.status), 'draft') AS spps_status,
        COALESCE(MAX(q.status), 'draft') AS spqs_status,
        s.updated_at
      FROM spis s
      LEFT JOIN spps p ON p.spis_id = s.id
      LEFT JOIN spqs q ON q.spis_id = s.id
      GROUP BY 
        s.id, s.doc_no, s.name, s.approved_by, s.status, s.updated_at
      ORDER BY s.updated_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching spareparts with documents:", err);
    res.status(500).json({ error: "Failed to fetch spareparts with documents" });
  }
});

// ✅ GET generate PDF (gabungan 3 file SPIS, SPPS, SPQS)
router.get("/:id/generate-pdf", async (req, res) => {
  const { id } = req.params;

  try {
    const [[spis]] = await db.query("SELECT * FROM spis WHERE id = ?", [id]);
    const [[spps]] = await db.query("SELECT * FROM spps WHERE spis_id = ?", [id]);
    const [[spqs]] = await db.query("SELECT * FROM spqs WHERE spis_id = ?", [id]);

    if (!spis) {
      return res.status(404).json({ error: "Dokumen tidak ditemukan" });
    }

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

// ✅ PUT approve dokumen
router.put("/approve", async (req, res) => {
  try {
    const { approved_by, doc_no } = req.body; // doc_no dari body request

    await db.query(
      `UPDATE spis SET approved_by = ?, status = 'completed' WHERE doc_no = ?`,
      [approved_by, doc_no]
    );

    await db.query(
      `UPDATE spps SET approved_by = ?, status = 'completed' WHERE spis_id = (SELECT id FROM spis WHERE doc_no = ?)`,
      [approved_by, doc_no]
    );

    await db.query(
      `UPDATE spqs SET approved_by = ?, status = 'completed' WHERE spis_id = (SELECT id FROM spis WHERE doc_no = ?)`,
      [approved_by, doc_no]
    );

    res.json({ message: "Documents approved successfully" });
  } catch (err) {
    console.error("Error approving documents:", err);
    res.status(500).json({ error: "Failed to approve documents" });
  }
});

// ✅ GET SPIS by doc_no (pakai query parameter)
router.get("/spis", async (req, res) => {
  try {
    const doc_no = req.query.doc_no;
    if (!doc_no)
      return res.status(400).json({ error: "doc_no query parameter is required" });

    // 🔍 Ambil data SPIS + signature dari user creator dan approver
    const [[spis]] = await db.query(`
      SELECT 
        s.*, 
        u1.signature_url AS created_signature_url, 
        u2.signature_url AS approved_signature_url
      FROM spis s
      LEFT JOIN users u1 ON u1.id = s.user_id         
LEFT JOIN users u2 ON u2.name = s.approved_by    
      WHERE s.doc_no = ?
    `, [doc_no]);

    if (!spis) {
      return res.status(404).json({ error: "Data SPIS tidak ditemukan" });
    }

    res.json(spis);
  } catch (err) {
    console.error("Error fetching SPIS:", err);
    res.status(500).json({ error: "Failed to fetch SPIS" });
  }
});

router.delete("/:doc_no", async (req, res) => {
  try {
    const { doc_no } = req.params;
    await db.query("DELETE FROM spis WHERE doc_no = ?", [doc_no]);
    await db.query("DELETE FROM spps WHERE doc_no = ?", [doc_no]);
    await db.query("DELETE FROM spqs WHERE doc_no = ?", [doc_no]);
    res.json({ message: "Dokumen berhasil dihapus" });
  } catch (err) {
    console.error("Error deleting document:", err);
    res.status(500).json({ error: "Gagal menghapus dokumen" });
  }
});

export default router;