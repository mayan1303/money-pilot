import Transaction from "../models/Transaction.js";

// ➕ Add Transaction
export const addTransaction = async (req, res) => {
  try {
    const { title, amount, category, type, userId } = req.body;

    // 🔥 VALIDATION
    if (!title || !amount || !category || !type || !userId) {
      return res.status(400).json({ message: "All fields required" });
    }

    const transaction = new Transaction({
      title,
      amount: Number(amount),
      category,
      type,
      user: userId,
    });

    const saved = await transaction.save();
    res.status(201).json(saved);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📜 Get Transactions (USER-SPECIFIC)
export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.query;

    // 🔥 IMPORTANT CHECK
    if (!userId) {
      return res.status(400).json({ message: "User ID missing" });
    }

    const data = await Transaction.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ❌ Delete Transaction (FULLY FIXED)
export const deleteTransaction = async (req, res) => {
  try {
    const { userId } = req.query;

    // 🔥 STEP 1: CHECK USER ID
    if (!userId) {
      return res.status(400).json({ message: "User ID missing" });
    }

    // 🔥 STEP 2: FIND TRANSACTION
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // 🔥 STEP 3: OWNER VALIDATION (IMPORTANT FIX)
    if (transaction.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 🔥 STEP 4: DELETE
    await Transaction.findByIdAndDelete(req.params.id);

    res.json({ message: "Transaction deleted successfully" });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: error.message });
  }
};