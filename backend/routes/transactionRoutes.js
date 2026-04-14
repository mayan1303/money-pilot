import express from "express";
import {
  addTransaction,
  getTransactions,
  deleteTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

// ➕ Add Transaction
router.post("/", addTransaction);

// 📜 Get User Transactions
router.get("/", getTransactions);

// ❌ Delete Transaction (WITH USER CHECK)
router.delete("/:id", deleteTransaction);

export default router;