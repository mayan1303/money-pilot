import Transaction from "../models/Transaction.js";

// ➕ Add Transaction
export const addTransaction = async (req, res) => {
  try {
    const { title, amount, category, type, userId } = req.body;

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

// 📜 Get Transactions
export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.query;

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

// ❌ Delete Transaction (FINAL FIX)
export const deleteTransaction = async (req, res) => {
  try {
    const { userId } = req.query;

    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await transaction.deleteOne();

    res.json({ message: "Deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};