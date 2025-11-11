# 🔧 Sparepart Management System

Sistem manajemen sparepart berbasis **React (frontend)** dan **Node.js + MySQL (backend)**  
Didesain untuk mengelola dokumen SPIS, SPPS, SPQS dengan status draft, approval, dan data siap kirim.

---

## 🚀 Tech Stack

### Frontend
- ⚛️ React + Vite
- 💅 TailwindCSS
- 🔄 Axios
- 🔔 React Toastify
- 🖋️ React Signature Canvas

### Backend
- 🟢 Node.js (Express)
- 🗄️ MySQL (via mysql2)
- 🔐 JWT Authentication
- 📁 Multer (upload file)
- ⚙️ dotenv

---

## 🧩 Persiapan Awal

### 1️⃣ Clone repository
```bash
git clone https://github.com/username/sparepart-management-system.git
cd sparepart-management-system

2️⃣ Setup database

Buat database baru di MySQL (misalnya sparepart_management_system)
Lalu import struktur tabel (contoh):
CREATE DATABASE sparepart_management_system;
USE sparepart_management_system;

-- Tabel user (contoh)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100),
  email VARCHAR(100),
  password VARCHAR(255),
  fullname VARCHAR(255),
  role ENUM('admin','approval','user') DEFAULT 'user',
  signature_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel SPIS, SPPS, SPQS (contoh struktur umum)
CREATE TABLE spis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doc_no VARCHAR(100),
  part_number VARCHAR(100),
  supplier VARCHAR(100),
  part_description TEXT,
  date DATE,
  status ENUM('draft','ready','approved') DEFAULT 'draft',
  created_by VARCHAR(100),
  approved_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

⚙️ Setup Backend (Node.js)

1️⃣ Masuk ke folder backend
cd backend-node
2️⃣ Install dependencies
npm install
3️⃣ Buat file .env
Isi seperti contoh berikut:
PORT=5050
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=sparepart_management_system
JWT_SECRET=my_secret_key
4️⃣ Jalankan backend
npm run dev
Backend akan berjalan di:
👉 http://127.0.0.1:5050

💻 Setup Frontend (React + Vite)

1️⃣ Masuk ke folder frontend
cd ../frontend
2️⃣ Install dependencies
npm install
3️⃣ Buat file .env
Isi dengan URL backend:
VITE_API_URL=http://127.0.0.1:5050/api
4️⃣ Jalankan frontend
npm run dev
Frontend akan berjalan di:
👉 http://localhost:5173


🧱 Build for Production

Backend

Jika ingin deploy ke server (misalnya cPanel atau VPS):
cd backend-node
npm install --production
Jalankan dengan:
node server.js
Atau gunakan PM2 agar tetap berjalan di background:
npm install -g pm2
pm2 start server.js --name sparepart-backend
Frontend

Untuk build versi production:
cd frontend
npm run build
Folder hasil build ada di:
frontend/dist/

Kamu bisa upload ke hosting, cPanel, atau Nginx static site.


📊 Fitur Utama

✅ Login & Authentication (JWT)
✅ Dashboard overview (total data, draft, siap approval)
✅ Form SPIS / SPPS / SPQS dengan status
✅ Upload file dan tanda tangan digital
✅ Multi-role: Admin, Approval, User
✅ Generate PDF (SPIS, SPPS, SPQS)
✅ Auto redirect login/dashboard
✅ Settings profile (fullname, password, signature)

🧠 Tips Developer
	•	Gunakan nodemon untuk backend development:
npm install -g nodemon
nodemon server.js

	•	Gunakan react-toastify untuk notifikasi di frontend
	•	Pastikan folder uploads/ ada di root backend dan memiliki izin tulis (chmod 755 uploads)

👨‍💻 Kontributor

Developer utama: Agus Andri Putra
Stack: React.js + Node.js + MySQL
Tujuan: Sistem manajemen sparepart dengan approval berjenjang dan digitalisasi dokumen

⸻

🏁 Lisensi

Proyek ini bersifat internal dan digunakan untuk kebutuhan sistem manajemen sparepart.
Hak cipta © 2025.

---

## 💡 Catatan
Kamu bisa menambahkan bagian “Deployment ke cPanel” kalau project ini mau dijalankan di hosting shared.  
Mau saya tambahkan juga langkah-langkah deploy ke cPanel (untuk backend dan frontend-nya sekalian)?
