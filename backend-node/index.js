import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import spisRoutes from "./routes/spisRoutes.js";
import sppsRoutes from "./routes/sppsRoutes.js";
import spqsRoutes from "./routes/spqsRoutes.js";
import sparepartsRoutes from "./routes/sparepartsRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
// import bcrypt from "bcrypt";

// const hash = await bcrypt.hash("admin123", 10);
// console.log(hash);

dotenv.config();
const app = express();

// ✅ Fix CORS
const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("✅ Node.js Backend for Sparepart Management System is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/spis", spisRoutes);
app.use("/api/spps", sppsRoutes);
app.use("/api/spqs", spqsRoutes);
app.use("/api/spareparts", sparepartsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


