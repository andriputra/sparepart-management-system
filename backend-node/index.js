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

dotenv.config();
const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for origin: " + origin));
    }
  },
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
// app.use("/api/spareparts/spis", spisRoutes);

console.log("✅ spisRoutes loaded at /api/spis");

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


