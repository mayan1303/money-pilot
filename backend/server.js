import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

// 🔥 ROUTES
import transactionRoutes from "./routes/transactionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// 🔥 MIDDLEWARE
app.use(cors());
app.use(express.json());

// 🔥 CONNECT DATABASE FIRST
connectDB();

// 🔥 TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 🔥 ROUTES
app.use("/api/transactions", transactionRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// 🔥 ERROR HANDLER (VERY IMPORTANT)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

// 🔥 SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});