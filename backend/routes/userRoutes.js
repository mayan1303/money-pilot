import express from "express";
import { getUser, updateBudget, updateUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 PROTECTED ROUTES
router.get("/", protect, getUser);
router.put("/budget", protect, updateBudget);

// 🔥 NEW: UPDATE USERNAME
router.put("/update", protect, updateUser);

export default router;