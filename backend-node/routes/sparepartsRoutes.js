import express from "express";
import db from "../config/db.js";

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
          s.doc_no AS spis_doc_no,
          COALESCE(MAX(p.doc_no), '') AS spps_doc_no,
          COALESCE(MAX(q.doc_no), '') AS spqs_doc_no,
          s.part_number,
          s.photo1,
          s.name AS created_by,
          s.approved_by,
          s.status AS spis_status,
          COALESCE(MAX(p.status), 'draft') AS spps_status,
          COALESCE(MAX(q.status), 'draft') AS spqs_status,
          CASE
              WHEN COALESCE(MAX(q.status), 'draft') != 'draft' THEN 'SPQS'
              WHEN COALESCE(MAX(p.status), 'draft') != 'draft' THEN 'SPPS'
              ELSE 'SPIS'
          END AS document_type,
          s.updated_at
      FROM spis s
      LEFT JOIN spps p ON p.spis_id = s.id
      LEFT JOIN spqs q ON q.spis_id = s.id
      GROUP BY s.id, s.doc_no, s.name, s.approved_by, s.status, s.updated_at
  `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching spareparts with documents:", err);
    res.status(500).json({ error: "Failed to fetch spareparts with documents" });
  }
});

router.put("/approve/:doc_no", async (req, res) => {
  const doc_no = decodeURIComponent(req.params.doc_no);

  try {
    // 🔹 Ambil fullname & signature user dengan role 'approval'
    const [[approver]] = await db.query(
      "SELECT fullname, signature_url FROM users WHERE role = 'approval' LIMIT 1"
    );

    if (!approver) {
      return res.status(404).json({ error: "User dengan role 'approval' tidak ditemukan" });
    }

    const approved_by = approver.fullname;
    const approved_signature_url = approver.signature_url || null;
    console.log("Approver fullname:", approved_by);

    // 🔹 Ambil spis_id berdasarkan doc_no
    const [[spis]] = await db.query("SELECT id FROM spis WHERE doc_no = ?", [doc_no]);
    if (!spis) {
      return res.status(404).json({ error: "SPIS tidak ditemukan untuk doc_no ini" });
    }

    // 🔹 Update semua tabel berdasarkan spis_id
    await db.query(
      "UPDATE spis SET approved_by = ?, status = 'completed' WHERE doc_no = ?",
      [approved_by, doc_no]
    );

    await db.query(
      "UPDATE spps SET approved_by = ?, status = 'completed' WHERE spis_id = ?",
      [approved_by, spis.id]
    );

    await db.query(
      "UPDATE spqs SET approved_by = ?, status = 'completed' WHERE spis_id = ?",
      [approved_by, spis.id]
    );

    res.json({
      message: `Dokumen ${doc_no} berhasil di-approve oleh ${approved_by}`,
      approved_by,
    });
  } catch (err) {
    console.error("Error approving:", err);
    res.status(500).json({
      error: "Gagal menyetujui dokumen",
      detail: err.message,
    });
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

// ✅ GET SPIS by doc_no (pakai query parameter)
router.get("/spis", async (req, res) => {
  try {
    const doc_no = req.query.doc_no;
    if (!doc_no)
      return res.status(400).json({ error: "doc_no query parameter is required" });

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

// ✅ GET SPPS by doc_no (pakai query parameter)
router.get("/spps", async (req, res) => {
  try {
    const doc_no = req.query.doc_no;
    if (!doc_no)
      return res.status(400).json({ error: "doc_no query parameter is required" });

    const [[spis]] = await db.query(`
      SELECT 
        s.*, 
        u1.signature_url AS created_signature_url, 
        u2.signature_url AS approved_signature_url
      FROM spps s
      LEFT JOIN users u1 ON u1.id = s.user_id         
      LEFT JOIN users u2 ON u2.name = s.approved_by    
      WHERE s.doc_no = ?
    `, [doc_no]);

    if (!spis) {
      return res.status(404).json({ error: "Data SPPS tidak ditemukan" });
    }

    res.json(spis);
  } catch (err) {
    console.error("Error fetching SPPS:", err);
    res.status(500).json({ error: "Failed to fetch SPPS" });
  }
});

// ✅ Ambil ilustrasi part dari SPIS berdasarkan spis_id
router.get("/spis/photo/:spis_id", async (req, res) => {
  try {
    const { spis_id } = req.params;
    const [[spis]] = await db.query(
      "SELECT photo1, photo2 FROM spis WHERE id = ?",
      [spis_id]
    );

    if (!spis) {
      return res.status(404).json({ error: "SPIS tidak ditemukan" });
    }

    res.json({
      photo1: spis.photo1 || null,
      photo2: spis.photo2 || null,
    });

  } catch (err) {
    console.error("Error fetching SPIS photo:", err);
    res.status(500).json({ error: "Failed to fetch SPIS photo" });
  }
});

// ✅ GET SPQS by doc_no (pakai query parameter)
router.get("/spqs", async (req, res) => {
  try {
    const doc_no = req.query.doc_no;
    if (!doc_no)
      return res.status(400).json({ error: "doc_no query parameter is required" });

    const [[spis]] = await db.query(`
      SELECT 
        s.*, 
        u1.signature_url AS created_signature_url, 
        u2.signature_url AS approved_signature_url
      FROM spqs s
      LEFT JOIN users u1 ON u1.id = s.user_id         
      LEFT JOIN users u2 ON u2.name = s.approved_by    
      WHERE s.doc_no = ?
    `, [doc_no]);

    if (!spis) {
      return res.status(404).json({ error: "Data SPQS tidak ditemukan" });
    }

    res.json(spis);
  } catch (err) {
    console.error("Error fetching SPQS:", err);
    res.status(500).json({ error: "Failed to fetch SPPS" });
  }
});
export default router;