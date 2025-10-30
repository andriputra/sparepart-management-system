import express from "express";
import multer from "multer";
import db from "../config/db.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ✅ Save final SPPS
router.post("/", upload.any(), async (req, res) => {
  try {
    const fields = req.body;
    const { user_id, spis_id } = fields;

    // ✅ Tambahkan validasi wajib
    if (!user_id || !spis_id) {
      return res.status(400).json({ error: "user_id dan spis_id wajib diisi" });
    }

    // 🔹 Map file upload
    const uploadedFiles = {};
    (req.files || []).forEach((file) => {
      uploadedFiles[file.fieldname] = `/uploads/${file.filename}`;
    });

    // 🔹 Kolom valid di tabel `spps`
    const allowedFields = [
      "doc_no", "date", "part_number", "supplier", "part_description", "qty",
      "part_weight", "part_dimension", "created_by", "approved_by",
      "package_material", "package_code", "package_detail", 
      "spis_id", "user_id", "status",
      "package_0", "package_1", "package_2", "package_3",
      "package_illustration_0", "package_illustration_1", "result_illustration"
    ];

    const rawData = { ...fields, ...uploadedFiles };
    const finalData = Object.keys(rawData)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = rawData[key];
        return obj;
      }, {});

    const [result] = await db.query("INSERT INTO spps SET ?", [finalData]);

    await db.query("UPDATE spis SET progress_status = 'step2' WHERE id = ?", [spis_id]);

    res.json({ message: "SPPS saved successfully", id: result.insertId });
  } catch (err) {
    console.error("❌ Error saving SPPS:", err);
    res.status(500).json({ error: "Failed to save SPPS" });
  }
});

router.get("/next-docno", async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    const [rows] = await db.query(
      "SELECT doc_no FROM spps WHERE doc_no LIKE ? ORDER BY id DESC LIMIT 1",
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

    res.json({ nextDocNo });
  } catch (err) {
    console.error("Error generating next doc number:", err);
    res.status(500).json({ error: "Failed to generate next doc_no" });
  }
});

router.put("/:id", upload.any(), async (req, res) => {
  try {
    const { id } = req.params;
    // Gabungkan text field dan file field
    const fields = { ...req.body };
    const uploadedFiles = {};

    (req.files || []).forEach((file) => {
      uploadedFiles[file.fieldname] = `/uploads/${file.filename}`;
    });

    const allowedFields = [
      "qty",
      "status",
      "package_material",
      "package_code",
      "package_detail",
      "package_0",
      "package_1",
      "package_2",
      "package_3",
      "package_illustration_0",
      "package_illustration_1",
      "result_illustration",
    ];

    // Gabung dan filter
    const rawData = { ...fields, ...uploadedFiles };
    const finalData = Object.keys(rawData)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = rawData[key];
        return obj;
      }, {});

    // ✅ Tambahkan safety check
    if (Object.keys(finalData).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    // Jalankan update
    if (finalData.qty === "" || finalData.qty === null || finalData.qty === undefined) {
      delete finalData.qty; // hindari error
    } else {
      finalData.qty = parseInt(finalData.qty, 10);
    }

    await db.query("UPDATE spps SET ? WHERE id = ?", [finalData, id]);

    res.json({ message: "SPPS updated successfully", updated: finalData });
  } catch (err) {
    console.error("❌ Error updating SPPS:", err);
    res.status(500).json({ error: "Failed to update SPPS" });
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


router.delete("/clear-draft/:userId", async (req, res) => {
  const { userId } = req.params;
  await db.query("DELETE FROM spps_draft WHERE user_id = ?", [userId]);
  res.json({ success: true });
});

router.get("/latest/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    // Ambil dokumen dengan status draft terakhir
    const [rows] = await db.query(
      "SELECT * FROM spps WHERE user_id = ? AND status = 'draft' ORDER BY updated_at DESC LIMIT 1",
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