import express from "express";
import multer from "multer";
import path from "path";
import db from "../config/db.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// === Konfigurasi upload tanda tangan ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/signatures"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// === GET profil user ===
router.get("/profile", authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, fullname, department, telephone, role, signature_url FROM users WHERE id = ?",
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal memuat profil" });
  }
});

// === Ubah fullname ===
router.put("/profile", authenticate, async (req, res) => {
    const { fullname, department, telephone } = req.body;
    try {
      await db.query(
        "UPDATE users SET fullname = ?, department = ?, telephone = ? WHERE id = ?",
        [fullname, department, telephone, req.user.id]
      );
      res.json({ message: "Data Profil berhasil diperbarui" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal update profil" });
    }
});

// === Ubah password ===
router.put("/password", authenticate, async (req, res) => {
  const { old_password, new_password } = req.body;
  try {
    const [rows] = await db.query("SELECT password FROM users WHERE id = ?", [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: "User tidak ditemukan" });

    const bcrypt = await import("bcrypt");
    const match = await bcrypt.default.compare(old_password, rows[0].password);
    if (!match) return res.status(400).json({ error: "Password lama salah" });

    const hashed = await bcrypt.default.hash(new_password, 10);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [hashed, req.user.id]);
    res.json({ message: "Password berhasil diperbarui" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal update password" });
  }
});

// === Upload tanda tangan ===
router.post("/signature", authenticate, upload.single("signature"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const signatureUrl = `/uploads/signatures/${req.file.filename}`;
        await db.query("UPDATE users SET signature_url = ? WHERE id = ?", [
        signatureUrl,
        req.user.id,
        ]);

        res.json({ signature_url: signatureUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Gagal upload tanda tangan" });
    }
});

export default router;