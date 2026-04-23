import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

// Add Transaction
export const addTransaction = async (req, res) => {
  try {
    const { title, amount, category, type, userId } = req.body;
    const numericAmount = Number(amount);

    if (!title || !amount || !category || !type || !userId) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    if (type === "expense") {
      const user = await User.findById(userId).select("savings");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const transactions = await Transaction.find({ user: userId }).select("type amount");
      const balance = transactions.reduce((total, transaction) => {
        return transaction.type === "income"
          ? total + transaction.amount
          : total - transaction.amount;
      }, 0);
      const budgetLeft = balance - Number(user.savings || 0);

      if (numericAmount > budgetLeft) {
        return res.status(400).json({
          message: "You\u2019re going over budget, boss \u26a0\ufe0f",
        });
      }
    }

    const transaction = new Transaction({
      title,
      amount: numericAmount,
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

// Get Transactions (USER-SPECIFIC)
export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID missing" });
    }

    const data = await Transaction.find({ user: userId }).sort({ createdAt: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Transaction
export const deleteTransaction = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID missing" });
    }

    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: error.message });
  }
};
