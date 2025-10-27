import express from "express";
import db from "../config/db.js";

const router = express.Router();

/**
 * ✅ CREATE FINAL SPQS
 * Data SPQS disimpan sebagai JSON (data_json)
 * dan update progress_status SPIS menjadi 'completed'
 */
router.post("/", async (req, res) => {
  try {
    const { user_id, spis_id, doc_no, ...rest } = req.body;

    // ✅ Validasi input wajib
    if (!user_id || !spis_id) {
      return res.status(400).json({ error: "user_id dan spis_id wajib diisi" });
    }

    // ✅ Ambil nomor dokumen otomatis jika belum dikirim
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

    // ✅ Simpan data SPQS
    await db.query(
      "INSERT INTO spqs (doc_no, user_id, spis_id, data_json, created_at) VALUES (?, ?, ?, ?, NOW())",
      [finalDocNo, user_id, spis_id, JSON.stringify(rest)]
    );

    // ✅ Update progress_status di SPIS
    await db.query(
      "UPDATE spis SET progress_status = 'completed' WHERE id = ?",
      [spis_id]
    );

    res.json({ message: "SPQS berhasil disimpan", doc_no: finalDocNo });
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

/**
 * ✅ GET SPIS DETAIL BY ID (untuk auto-fill form SPQS)
 */
// router.get("/:id", async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       `SELECT id, part_number, part_description, part_dimension, part_weight,
//               part_material, inspection, photo1_url AS illustration_part
//          FROM spis
//         WHERE id = ?`,
//       [req.params.id]
//     );

//     if (rows.length === 0)
//       return res.status(404).json({ error: "SPIS tidak ditemukan" });

//     // Parse inspection JSON jika ada
//     const spisData = rows[0];
//     if (spisData.inspection && typeof spisData.inspection === "string") {
//       try {
//         spisData.inspection = JSON.parse(spisData.inspection);
//       } catch (e) {
//         console.warn("⚠️ Failed to parse inspection JSON:", e.message);
//       }
//     }

//     res.json(spisData);
//   } catch (err) {
//     console.error("❌ Failed to fetch SPIS:", err);
//     res.status(500).json({ error: "Gagal mengambil data SPIS" });
//   }
// });
// ✅ Get SPIS by ID
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

export default router;