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

      // Helper to remove protocol and host from a URL, returning only the relative path
      const stripBaseUrl = (url) => {
        if (!url || typeof url !== "string") return null;
        // Remove blob: URLs or empty
        if (url.startsWith("blob:")) return null;
        // Remove protocol and host (e.g. http://127.0.0.1:5050)
        return url.replace(/^https?:\/\/[^/]+/, "");
      };

      // Uploaded file always uses relative path
      const photo1Path = req.files?.photo1
        ? stripBaseUrl(`/uploads/spis/${req.files.photo1[0].filename}`)
        : stripBaseUrl(req.body.photo1_url);

      const photo2Path = req.files?.photo2
        ? stripBaseUrl(`/uploads/spis/${req.files.photo2[0].filename}`)
        : stripBaseUrl(req.body.photo2_url);

      // === Parse JSON fields
      const partMaterialJSON =
        typeof part_material === "string" ? JSON.parse(part_material) : part_material;
      const inspectionJSON =
        typeof inspection === "string" ? JSON.parse(inspection) : inspection;

      // === Handle multiple part images
      const imageUrls =
        req.body.part_image_urls && typeof req.body.part_image_urls === "string"
          ? JSON.parse(req.body.part_image_urls)
          : [];
      const imageDescs =
        req.body.part_image_descriptions &&
        typeof req.body.part_image_descriptions === "string"
          ? JSON.parse(req.body.part_image_descriptions)
          : [];
      const uploadedFiles = req.files?.part_images || [];

      const combinedImages = [];
      for (let i = 0; i < Math.max(uploadedFiles.length, imageUrls.length); i++) {
        combinedImages.push({
          url: uploadedFiles[i]
            ? stripBaseUrl(`/uploads/spis/${uploadedFiles[i].filename}`)
            : stripBaseUrl(imageUrls[i] || null),
          description: imageDescs[i] || "",
        });
      }

      // === Cek apakah doc_no sudah ada di DB
      const [existing] = await db.query(
        "SELECT id FROM spis WHERE doc_no = ? LIMIT 1",
        [doc_no]
      );

      const safeDate = date && date.trim() !== "" ? date : null;

      if (existing.length > 0) {
        // === UPDATE jika memang edit SPIS tertentu
        await db.query(
          `UPDATE spis SET 
            user_id=?, date=?, location=?, code=?, name=?, department=?, telephone=?,
            part_number=?, supplier=?, part_description=?, detail_part=?, description=?,
            photo1=?, photo2=?, part_material=?, inspection=?, part_images=?,
            created_by=?, approved_by=?, status=?, updated_at=NOW()
          WHERE id=?`,
          [
            user_id,
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
            JSON.stringify(combinedImages),
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

      // === INSERT baru
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
          JSON.stringify(combinedImages),
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
  try {
    const { user_id, data } = req.body;

    if (!user_id || !data) {
      return res.status(400).json({ message: "Missing data" });
    }

    // Simpan draft (update jika sudah ada)
    const [existing] = await db.query(
      "SELECT id FROM spis WHERE doc_no = ? LIMIT 1",
      [data.doc_no]
    );

    const dataJson = JSON.stringify(data);

    if (existing.length > 0) {
      await db.query(
        `UPDATE spis SET data_json = ?, status = 'draft', updated_at = NOW() WHERE id = ?`,
        [dataJson, existing[0].id]
      );
      res.json({ message: "Draft updated successfully", id: existing[0].id });
    } else {
      const [result] = await db.query(
        `INSERT INTO spis (user_id, doc_no, data_json, status, created_at, updated_at)
         VALUES (?, ?, ?, 'draft', NOW(), NOW())`,
        [user_id, data.doc_no, dataJson]
      );
      res.json({ message: "Draft saved successfully", id: result.insertId });
    }
  } catch (err) {
    console.error("Error saving draft:", err);
    res.status(500).json({ message: "Failed to save draft" });
  }
});

// ✅ [GET] Ambil SPIS berdasarkan doc_no
router.get("/by-doc/:doc_no", async (req, res) => {
  try {
    const decodedDocNo = decodeURIComponent(req.params.doc_no);
    const [rows] = await db.query(
      `SELECT 
          s.*, 
          COALESCE(uc.signature_url, uc2.signature_url) AS created_signature_url,
          COALESCE(ua.signature_url, ua2.signature_url) AS approved_signature_url
       FROM spis s
       LEFT JOIN users uc ON uc.fullname = s.created_by
       LEFT JOIN users uc2 ON uc2.name = s.created_by
       LEFT JOIN users ua ON ua.fullname = s.approved_by
       LEFT JOIN users ua2 ON ua2.name = s.approved_by
       WHERE s.doc_no = ?`,
      [decodedDocNo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "SPIS not found" });
    }

    const data = rows[0];
    let parsedData = {};
    try {
      parsedData = data.data_json ? JSON.parse(data.data_json) : {};
    } catch (e) {
      console.warn("Gagal parse data_json:", e.message);
    }

    // Jika draft → pakai data_json
    if (data.status === "draft") {
      return res.json({
        ...parsedData,
        doc_no: data.doc_no,
        status: data.status,
        id: data.id,
        created_by: data.created_by,
        approved_by: data.approved_by || parsedData.approved_by || "",
        created_signature_url: data.created_signature_url,
        approved_signature_url: data.approved_signature_url,
      });
    }

    res.json({
      ...parsedData,
      ...data,
      created_signature_url: data.created_signature_url,
      approved_signature_url: data.approved_signature_url,
    });
  } catch (err) {
    console.error("Error fetching SPIS by doc_no:", err);
    res.status(500).json({ error: "Failed to fetch SPIS by doc_no" });
  }
});

router.get("/draft/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [draftRows] = await db.query(
      "SELECT * FROM spis_draft WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1",
      [userId]
    );

    if (!draftRows.length) {
      return res.json(null);
    }

    const draft = draftRows[0];
    const [submitted] = await db.query(
      "SELECT id FROM spis WHERE doc_no = ?",
      [draft.doc_no]
    );

    if (submitted.length > 0) {
      await db.query("DELETE FROM spis_draft WHERE id = ?", [draft.id]);
      return res.json(null);
    }
    return res.json(draft);
  } catch (err) {
    console.error("Error fetching draft:", err);
    res.status(500).json({ error: "Failed to load draft" });
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

router.get("/latest/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT doc_no, status, data_json, updated_at FROM spis WHERE user_id = ? AND status = 'draft' ORDER BY updated_at DESC LIMIT 1",
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

// === GET /api/spis/for-next/:user_id ===
router.get("/for-next/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const [draft] = await db.query(
      "SELECT doc_no, status, data_json, updated_at FROM spis WHERE user_id = ? AND status = 'draft' ORDER BY updated_at DESC LIMIT 1",
      [user_id]
    );

    if (draft.length > 0) {
      return res.json({
        doc_no: draft[0].doc_no,
        status: draft[0].status,
        data: JSON.parse(draft[0].data_json || "{}"),
      });
    }

    const [submitted] = await db.query(
      "SELECT * FROM spis WHERE user_id = ? AND status = 'submitted' ORDER BY updated_at DESC LIMIT 1",
      [user_id]
    );
    
    if (submitted.length > 0) {
      let parsedData = {};
      try {
        parsedData = submitted[0].data_json ? JSON.parse(submitted[0].data_json) : {};
      } catch (e) {
        console.warn("Failed to parse submitted data_json for user:", user_id);
      }
    
      return res.json({
        doc_no: submitted[0].doc_no,
        status: submitted[0].status,
        data: {
          ...parsedData, 
          part_number: submitted[0].part_number,
          supplier: submitted[0].supplier,
          part_description: submitted[0].part_description,
          detail_part: submitted[0].detail_part,
          date: submitted[0].date,
          code: submitted[0].code,
          name: submitted[0].name,
          department: submitted[0].department,
          photo1: submitted[0].photo1,
          photo2: submitted[0].photo2,
        },
      });
    }

    res.json(null);
  } catch (err) {
    console.error("Error fetching SPIS for continuation:", err);
    res.status(500).json({ error: "Failed to fetch SPIS for next step" });
  }
});




router.get("/by-id/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM spis WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "SPIS not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching SPIS by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;