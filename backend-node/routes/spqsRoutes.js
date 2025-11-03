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

    const safeCriteria = {
      package_dimension: criteria.package_dimension || "",
      package_dimension_ok: criteria.package_dimension_ok ? 1 : 0,
      package_dimension_remark: criteria.package_dimension_remark || "",
      weight: criteria.weight || "",
      weight_ok: criteria.weight_ok ? 1 : 0,
      weight_remark: criteria.weight_remark || "",
      material: criteria.material || "",
      material_ok: criteria.material_ok ? 1 : 0,
      material_remark: criteria.material_remark || "",
      finishing: criteria.finishing || "",
      finishing_ok: criteria.finishing_ok ? 1 : 0,
      finishing_remark: criteria.finishing_remark || "",
      function: criteria.function || "",
      function_ok: criteria.function_ok ? 1 : 0,
      function_remark: criteria.function_remark || "",
      completeness: criteria.completeness || "",
      completeness_ok: criteria.completeness_ok ? 1 : 0,
      completeness_remark: criteria.completeness_remark || "",
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
        spis_id, user_id, doc_no, part_number, date, part_description, supplier,
        criteria_dimension, criteria_dimension_ok, criteria_dimension_remark,
        criteria_weight, criteria_weight_ok, criteria_weight_remark,
        criteria_material, criteria_material_ok, criteria_material_remark,
        criteria_finishing, criteria_finishing_ok, criteria_finishing_remark,
        criteria_function, criteria_function_ok, criteria_function_remark,
        criteria_completeness, criteria_completeness_ok, criteria_completeness_remark,
        surface_wear, surface_damage, surface_scratch, surface_crack, surface_corrosion, surface_bend,
        result, comment, created_by, approved_by, checked_by, status, data_json, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        spis_id,
        user_id,
        finalDocNo,
        part_number || "",
        safeDate,
        part_description || "",
        supplier || "",
        safeCriteria.package_dimension,
        safeCriteria.package_dimension_ok,
        safeCriteria.package_dimension_remark,
        safeCriteria.weight,
        safeCriteria.weight_ok,
        safeCriteria.weight_remark,
        safeCriteria.material,
        safeCriteria.material_ok,
        safeCriteria.material_remark,
        safeCriteria.finishing,
        safeCriteria.finishing_ok,
        safeCriteria.finishing_remark,
        safeCriteria.function,
        safeCriteria.function_ok,
        safeCriteria.function_remark,
        safeCriteria.completeness,
        safeCriteria.completeness_ok,
        safeCriteria.completeness_remark,
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
        "submitted",
        JSON.stringify(req.body || {}) // 🧩 inilah yang tadinya hilang!
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
    const [rows] = await db.query(
      "SELECT doc_no, status, data_json, updated_at FROM spqs WHERE user_id = ? AND status = 'draft' ORDER BY updated_at DESC LIMIT 1",
      [user_id]
    );

    if (rows.length === 0) {
      return res.json(null);
    }

    const row = rows[0];
    let parsedData = {};
    try {
      parsedData = row.data_json ? JSON.parse(row.data_json) : {};
    } catch (err) {
      console.warn("⚠️ Failed to parse data_json for user", user_id);
    }

    res.json({
      doc_no: row.doc_no,
      status: row.status,
      data: parsedData,
      updated_at: row.updated_at,
    });
  } catch (err) {
    console.error("Error fetching latest draft:", err);
    res.status(500).json({ error: "Failed to fetch draft" });
  }
});


// ✅ Get SPQS draft or data by spis_id
router.get("/by-spis/:spis_id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM spqs WHERE spis_id = ?", [req.params.spis_id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "No SPQS found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching SPQS by spis_id:", err);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;