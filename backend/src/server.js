import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import helmet from "helmet";

import { connectDB } from "./config/db.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { initSocket } from "./socket.js";
import { apiLimiter } from "./middleware/rateLimit.js"; 
dotenv.config();

const app = express();
const server = http.createServer(app);

// 🔐 security
app.use(helmet());

// ✅ middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://shaina-cafe.vercel.app",
    "https://shainacafe-rawatsar.com",
    "https://www.shainacafe-rawatsar.com"
  ],
  credentials: true
}));

app.use(express.json());
app.use("/api", apiLimiter);

// routes
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

// test
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// db
connectDB();

// socket
initSocket(server);

// ✅ SINGLE LISTEN (IMPORTANT)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});
