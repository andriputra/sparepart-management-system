import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { user_id, spis_id, doc_no, criteria = {}, result, comment, created_by, approved_by, checked_by, date, part_number, part_description, supplier } = req.body;

    // Validasi
    if (!user_id || !spis_id) {
      return res.status(400).json({ error: "user_id dan spis_id wajib diisi" });
    }

    // Generate doc_no otomatis jika belum ada
    let finalDocNo = doc_no;
    if (!finalDocNo) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");

      const [rows] = await db.query(
        "SELECT doc_no FROM spqs WHERE doc_no LIKE ? ORDER BY id DESC LIMIT 1",
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
      finalDocNo = `IM/SPQS/${year}/${month}/${padded}`;
    }

    // --- Normalize data ---
    const safeCriteria = {
      package_dimension: criteria.package_dimension || "",
      weight: criteria.weight || "",
      material: criteria.material || "",
      finishing: criteria.finishing || "",
      function: criteria.function || "",
      completeness: criteria.completeness || "",
    };

    const surface = criteria.surface || {};
    const safeSurface = {
      wear: surface.wear ? 1 : 0,
      damage: surface.damage ? 1 : 0,
      scratch: surface.scratch ? 1 : 0,
      crack: surface.crack ? 1 : 0,
      corrosion: surface.corrosion ? 1 : 0,
      bend: surface.bend ? 1 : 0,
    };

    const safeResult = result || "Pass";
    const safeComment = comment || "";
    const safeCreatedBy = created_by || "";
    const safeApprovedBy = approved_by || "";
    const safeCheckedBy = checked_by || "";
    const safeDate = date || new Date();

    // --- INSERT query lengkap ---
    await db.query(
      `INSERT INTO spqs (
        spis_id,
        user_id,
        doc_no,
        part_number,
        date,
        part_description,
        supplier,
        criteria_dimension,
        criteria_weight,
        criteria_material,
        criteria_finishing,
        criteria_function,
        criteria_completeness,
        surface_wear,
        surface_damage,
        surface_scratch,
        surface_crack,
        surface_corrosion,
        surface_bend,
        result,
        comment,
        created_by,
        approved_by,
        checked_by,
        status,
        data_json,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted', ?, NOW())`,
      [
        spis_id,
        user_id,
        finalDocNo,
        part_number || "",
        safeDate,
        part_description || "",
        supplier || "",
        safeCriteria.package_dimension,
        safeCriteria.weight,
        safeCriteria.material,
        safeCriteria.finishing,
        safeCriteria.function,
        safeCriteria.completeness,
        safeSurface.wear,
        safeSurface.damage,
        safeSurface.scratch,
        safeSurface.crack,
        safeSurface.corrosion,
        safeSurface.bend,
        safeResult,
        safeComment,
        safeCreatedBy,
        safeApprovedBy,
        safeCheckedBy,
        JSON.stringify(req.body || {})
      ]
    );

    // --- Update progress di SPIS ---
    await db.query("UPDATE spis SET progress_status = 'completed' WHERE id = ?", [spis_id]);

    res.json({ message: "✅ SPQS berhasil disimpan", doc_no: finalDocNo });
  } catch (err) {
    console.error("❌ Error saving SPQS:", err);
    res.status(500).json({ error: "Gagal menyimpan SPQS" });
  }
});

/**
 * ✅ SAVE DRAFT
 * Simpan data sementara ke tabel spqs_draft
 */
router.post("/save-draft", async (req, res) => {
  const { user_id, data } = req.body;
  if (!user_id) {
    return res.status(400).json({ error: "user_id wajib diisi" });
  }

  try {
    await db.query(
      "REPLACE INTO spqs_draft (user_id, data_json, updated_at) VALUES (?, ?, NOW())",
      [user_id, JSON.stringify(data)]
    );
    res.json({ message: "Draft SPQS berhasil disimpan" });
  } catch (err) {
    console.error("❌ Failed to save SPQS draft:", err);
    res.status(500).json({ error: "Gagal menyimpan draft SPQS" });
  }
});

/**
 * ✅ GET DRAFT BY USER
 */
router.get("/draft/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT data_json FROM spqs_draft WHERE user_id = ?",
      [user_id]
    );
    res.json(rows.length ? JSON.parse(rows[0].data_json) : null);
  } catch (err) {
    console.error("❌ Failed to fetch draft:", err);
    res.status(500).json({ error: "Gagal mengambil draft SPQS" });
  }
});

/**
 * ✅ GET NEXT DOC NUMBER (untuk form SPQS)
 */
router.get("/next-docno", async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    const [rows] = await db.query(
      "SELECT doc_no FROM spqs WHERE doc_no LIKE ? ORDER BY id DESC LIMIT 1",
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
    console.error("❌ Error generating next SPQS doc_no:", err);
    res.status(500).json({ error: "Gagal menghasilkan nomor dokumen SPQS" });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM spis WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'SPIS not found' });
    }

    const spis = rows[0];

    // Parse JSON fields (jika ada)
    if (spis.part_material) {
      try {
        spis.part_material = JSON.parse(spis.part_material);
      } catch {
        spis.part_material = [spis.part_material];
      }
    }

    if (spis.inspection) {
      try {
        spis.inspection = JSON.parse(spis.inspection);
      } catch {
        spis.inspection = {};
      }
    }

    // kirim respons lengkap
    res.json(spis);
  } catch (err) {
    console.error('Error fetching SPIS by ID:', err);
    res.status(500).json({ error: 'Failed to fetch SPIS data' });
  }
});

router.get("/latest/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    // Ambil dokumen dengan status draft terakhir
    const [rows] = await db.query(
      "SELECT * FROM spqs WHERE user_id = ? AND status = 'draft' ORDER BY updated_at DESC LIMIT 1",
      [user_id]
    );
    if (rows.length === 0) {
      return res.json(null);
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching latest draft:", err);
    res.status(500).json({ error: "Failed to fetch draft" });
  }
});

export default router;