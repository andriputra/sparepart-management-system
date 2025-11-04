import express from "express";
import multer from "multer";
import db from "../config/db.js";
import path from "path";
import fs from "fs";

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/spps";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });
router.post("/", upload.any(), async (req, res) => {
  try {
    const fields = req.body;
    const { user_id, spis_id } = fields;

    if (!user_id || !spis_id) {
      return res.status(400).json({ error: "user_id dan spis_id wajib diisi" });
    }

    // 🔹 Map file upload
    const uploadedFiles = {};
    (req.files || []).forEach((file) => {
      uploadedFiles[file.fieldname] = `/uploads/spps/${file.filename}`;
    });

    // 🔹 Generate doc_no otomatis SPPS
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

    // 🔹 Kolom valid
    const allowedFields = [
      "date", "part_number", "supplier", "part_description", "qty",
      "part_weight", "part_dimension", "created_by", "approved_by", "detail_part",
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

    // 🔹 Pastikan doc_no benar
    finalData.doc_no = nextDocNo;

    const [result] = await db.query("INSERT INTO spps SET ?", [finalData]);

    await db.query("UPDATE spis SET progress_status = 'step2' WHERE id = ?", [spis_id]);

    res.json({ message: "SPPS saved successfully", id: result.insertId, doc_no: nextDocNo });
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
      uploadedFiles[file.fieldname] = `/uploads/spps/${file.filename}`;
    });

    const allowedFields = [
      "qty",
      "status",
      "detail_part",
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
    const [rows] = await db.query(
      "SELECT doc_no, status, data_json, updated_at FROM spps WHERE user_id = ? AND status = 'draft' ORDER BY updated_at DESC LIMIT 1",
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

router.get("/by-spis/:spis_id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM spps WHERE spis_id = ?", [req.params.spis_id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "No SPPS found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching SPPS by spis_id:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Ambil data SPPS berdasarkan ID
router.get("/by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM spps WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "SPPS not found" });
    }

    const spps = rows[0];

    // Parsing JSON fields jika ada
    if (spps.part_material) {
      try {
        spps.part_material = JSON.parse(spps.part_material);
      } catch {
        spps.part_material = [spps.part_material];
      }
    }

    if (spps.data_json) {
      try {
        spps.data_json = JSON.parse(spps.data_json);
      } catch {
        spps.data_json = {};
      }
    }

    res.json(spps);
  } catch (err) {
    console.error("Error fetching SPPS by ID:", err);
    res.status(500).json({ error: "Failed to fetch SPPS" });
  }
});
export default router;