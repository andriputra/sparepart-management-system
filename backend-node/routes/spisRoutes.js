import express from "express";
import multer from "multer";
import db from "../config/db.js";
import path from "path";

const router = express.Router();

// === Setup Multer untuk upload foto ===
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/spis")
    },
    filename: (req, file, cb) =>{
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage });
router.post("/upload-photo", upload.single("photo"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const photoUrl = `/uploads/spis/${req.file.filename}`;
    res.json({ photo_url: photoUrl });
});

router.get("/last-docno", async (req, res) => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
  
      const [rows] = await db.query(
        "SELECT doc_no FROM spis WHERE doc_no LIKE ? ORDER BY id DESC LIMIT 1",
        [`IM/SPIS/${year}/${month}/%`]
      );
  
      if (rows.length === 0) {
        return res.json({ lastNumber: 0 });
      }
  
      const lastDocNo = rows[0].doc_no;
      const parts = lastDocNo.split("/");
      const lastNumber = parseInt(parts[4], 10) || 0;
  
      res.json({ lastNumber });
    } catch (err) {
      console.error("Error fetching last doc_no:", err);
      res.status(500).json({ error: "Failed to get last doc_no" });
    }
});

// === POST /api/spis ===
// Simpan data SPIS ke database
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const {
      doc_no,
      date,
      location,
      code,
      name,
      department,
      telephone,
      part_number,
      supplier,
      part_description,
      remarks,
      part_material,
      inspection,
      created_by,
      approved_by,
    } = req.body;

    const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await db.query(
      `INSERT INTO spis (
        doc_no, date, location, code, name, department, telephone,
        part_number, supplier, part_description, remarks, photo,
        part_material, inspection, created_by, approved_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        doc_no,
        date,
        location,
        code,
        name,
        department,
        telephone,
        part_number,
        supplier,
        part_description,
        remarks,
        photoPath,
        part_material,
        inspection,
        created_by,
        approved_by,
      ]
    );

    res.status(201).json({ id: result.insertId, message: "SPIS saved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save SPIS" });
  }
});

// === GET /api/spis ===
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM spis ORDER BY id DESC");
  res.json(rows);
});

// === POST /api/spis/save-draft ===
// router.post("/save-draft", async (req, res) => {
//     try {
//       const { user_id, data } = req.body;
  
//       const [existing] = await db.query(
//         "SELECT id FROM spis WHERE user_id = ? AND status = 'draft'",
//         [user_id]
//       );
  
//       if (existing.length > 0) {
//         await db.query("UPDATE spis SET data_json = ?, updated_at = NOW() WHERE id = ?", [
//           JSON.stringify(data),
//           existing[0].id,
//         ]);
//         res.json({ message: "Draft updated successfully" });
//       } else {
//         await db.query("INSERT INTO spis (user_id, data_json, status) VALUES (?, ?, 'draft')", [
//           user_id,
//           JSON.stringify(data),
//         ]);
//         res.json({ message: "Draft saved successfully" });
//       }
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Failed to save draft" });
//     }
//   });
  router.post("/save-draft", async (req, res) => {
    const { user_id, data } = req.body;
    try {
      await db.query("REPLACE INTO spis_draft (user_id, data_json) VALUES (?, ?)", [
        user_id,
        JSON.stringify(data),
      ]);
      res.json({ message: "Draft saved successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to save draft" });
    }
  });
  
  // === GET /api/spis/draft/:user_id ===
//   router.get("/draft/:user_id", async (req, res) => {
//     const { user_id } = req.params;
//     try {
//       const [rows] = await db.query(
//         "SELECT * FROM spis WHERE user_id = ? AND status = 'draft' ORDER BY updated_at DESC LIMIT 1",
//         [user_id]
//       );
//       if (rows.length > 0) {
//         res.json(JSON.parse(rows[0].data_json));
//       } else {
//         res.json(null);
//       }
//     } catch (err) {
//       res.status(500).json({ error: "Failed to fetch draft" });
//     }
//   });
  router.get("/draft/:user_id", async (req, res) => {
    const { user_id } = req.params;
    try {
      const [rows] = await db.query(
        "SELECT data_json FROM spis_draft WHERE user_id = ?",
        [user_id]
      );s
      res.json(rows.length ? JSON.parse(rows[0].data_json) : null);
    } catch (err) {
      res.status(500).json({ error: "Failed to get draft" });
    }
  });

export default router;