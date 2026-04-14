import express from "express";
import {
  getUser,
  updateBudget,
  updateUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 GET LOGGED-IN USER (from token)
router.get("/", protect, getUser);

// 🔥 NEW: GET USER BY ID (VERY IMPORTANT FIX)
router.get("/:id", async (req, res) => {
  try {
    const user = await (await import("../models/User.js")).default.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔐 UPDATE SAVINGS
router.put("/budget", protect, updateBudget);

// 🔐 UPDATE USERNAME
router.put("/update", protect, updateUser);

export default router;