import express from "express";
import multer from "multer";
import db from "../config/db.js";
import path from "path";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// === Setup Multer untuk upload foto ===
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/spis");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// === Upload Foto ===
router.post("/upload-photo", upload.single("photo"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    const photoUrl = `/uploads/spis/${req.file.filename}`;
    res.json({ photo_url: photoUrl });
});

// === GET /api/spis/next-docno ===
router.get("/next-docno", async (req, res) => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
  
      const [rows] = await db.query(
        "SELECT doc_no FROM spis WHERE doc_no LIKE ? ORDER BY id DESC LIMIT 1",
        [`IM/SPIS/${year}/${month}/%`]
      );
  
      let nextNumber = 1;
      if (rows.length > 0) {
        const lastDocNo = rows[0].doc_no;
        const parts = lastDocNo.split("/");
        const lastNumber = parseInt(parts[4], 10);
        nextNumber = lastNumber + 1;
      }
  
      const padded = String(nextNumber).padStart(5, "0");
      const nextDocNo = `IM/SPIS/${year}/${month}/${padded}`;
  
      res.json({ nextDocNo });
    } catch (err) {
      console.error("Error generating next doc number:", err);
      res.status(500).json({ error: "Failed to generate next doc_no" });
    }
});

// === Get Last Doc No ===
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

router.post(
  "/",
  upload.fields([
    { name: "photo1", maxCount: 1 },
    { name: "photo2", maxCount: 1 },
    { name: "part_images", maxCount: 8 },
  ]),
  async (req, res) => {
    try {
      const {
        user_id,
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
        description,
        detail_part,
        part_material,
        inspection,
        created_by,
        approved_by,
        status,
      } = req.body;

      if (!user_id) {
        return res.status(400).json({ error: "Missing user_id" });
      }

      // === Handle photo1 & photo2
      const photo1Path = req.files?.photo1
        ? `/uploads/spis/${req.files.photo1[0].filename}`
        : req.body.photo1_url || null;

      const photo2Path = req.files?.photo2
        ? `/uploads/spis/${req.files.photo2[0].filename}`
        : req.body.photo2_url || null;

      // === Parse JSON fields
      const partMaterialJSON =
        typeof part_material === "string" ? JSON.parse(part_material) : part_material;
      const inspectionJSON =
        typeof inspection === "string" ? JSON.parse(inspection) : inspection;

      // === Handle multiple part images (max 8)
      const descriptions =
        req.body.part_image_descriptions &&
        typeof req.body.part_image_descriptions === "string"
          ? JSON.parse(req.body.part_image_descriptions)
          : [];

      let uploadedPartImages = [];

      if (req.files?.part_images && req.files.part_images.length > 0) {
        uploadedPartImages = req.files.part_images.map((file, i) => ({
          url: `/uploads/spis/${file.filename}`,
          description: descriptions[i]?.description || "",
        }));
      }

      // === Check existing submitted SPIS
      const [existing] = await db.query(
        "SELECT id FROM spis WHERE user_id = ? AND status = 'submitted' LIMIT 1",
        [user_id]
      );

      const safeDate = date && date.trim() !== "" ? date : null;

      if (existing.length > 0) {
        await db.query(
          `UPDATE spis SET 
            doc_no=?, date=?, location=?, code=?, name=?, department=?, telephone=?,
            part_number=?, supplier=?, part_description=?, detail_part=?, description=?,
            photo1=?, photo2=?, part_material=?, inspection=?, part_images=?,
            created_by=?, approved_by=?, status=?, updated_at=NOW()
          WHERE id=?`,
          [
            doc_no,
            safeDate,
            location,
            code,
            name,
            department,
            telephone,
            part_number,
            supplier,
            part_description,
            detail_part,
            description,
            photo1Path,
            photo2Path,
            JSON.stringify(partMaterialJSON),
            JSON.stringify(inspectionJSON),
            JSON.stringify(uploadedPartImages),
            created_by,
            approved_by,
            status || "submitted",
            existing[0].id,
          ]
        );
        return res.json({
          message: "SPIS updated successfully",
          id: existing[0].id,
        });
      }

      // === Insert new SPIS
      const [result] = await db.query(
        `INSERT INTO spis (
          user_id, doc_no, date, location, code, name, department, telephone,
          part_number, supplier, part_description, detail_part,
          photo1, photo2, part_material, inspection, part_images,
          created_by, approved_by, status, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          doc_no,
          safeDate,
          location,
          code,
          name,
          department,
          telephone,
          part_number,
          supplier,
          part_description,
          detail_part,
          photo1Path,
          photo2Path,
          JSON.stringify(partMaterialJSON),
          JSON.stringify(inspectionJSON),
          JSON.stringify(uploadedPartImages),
          created_by,
          approved_by,
          status || "submitted",
          description,
        ]
      );

      res.status(201).json({
        id: result.insertId,
        message: "SPIS created successfully",
      });
    } catch (err) {
      console.error("Error saving SPIS:", err);
      res.status(500).json({ error: "Failed to save SPIS" });
    }
  }
);

// === GET /api/spis ===
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM spis ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch SPIS list" });
  }
});

// === Save Draft ===
router.post("/save-draft", async (req, res) => {
  const { user_id, data } = req.body;
  try {
    if (!user_id) return res.status(400).json({ error: "Missing user_id" });

    await db.query(
      "REPLACE INTO spis_draft (user_id, data_json, updated_at) VALUES (?, ?, NOW())",
      [user_id, JSON.stringify(data)]
    );

    res.json({ message: "Draft saved successfully" });
  } catch (err) {
    console.error("Error saving draft:", err);
    res.status(500).json({ error: "Failed to save draft" });
  }
});

// === Get Draft ===
router.get("/draft/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT data_json FROM spis_draft WHERE user_id = ?",
      [user_id]
    );

    res.json(rows.length ? JSON.parse(rows[0].data_json) : null);
  } catch (err) {
    console.error("Error fetching draft:", err);
    res.status(500).json({ error: "Failed to get draft" });
  }
});

// === Gabungkan SPIS + Draft ===
router.get("/all", async (req, res) => {
    try {
      // 1️⃣ Ambil data submitted
      const [submittedRows] = await db.query(
        "SELECT id, user_id, doc_no, part_number, supplier, name, created_by, status, updated_at FROM spis"
      );
  
      // 2️⃣ Ambil data draft
      const [draftRows] = await db.query(
        "SELECT user_id, data_json, updated_at FROM spis_draft"
      );
  
      // 3️⃣ Parse draft JSON & samakan struktur kolomnya
      const parsedDrafts = draftRows.map((row) => {
        const data = JSON.parse(row.data_json);
        return {
          id: `draft-${row.user_id}`,
          user_id: row.user_id,
          doc_no: data.doc_no || "-",
          part_number: data.part_number || "-",
          supplier: data.supplier || "-",
          name: data.name || "-",
          created_by: data.created_by || "-",
          status: "draft",
          updated_at: row.updated_at,
        };
      });
  
      // 4️⃣ Gabungkan keduanya dan urutkan berdasarkan waktu update
      const combined = [...parsedDrafts, ...submittedRows].sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );
  
      res.json(combined);
    } catch (err) {
      console.error("Error combining SPIS data:", err);
      res.status(500).json({ error: "Failed to combine SPIS list" });
    }
});
export default router;