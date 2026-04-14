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
      amount,
      category,
      type,
      user: userId, // 🔥 LINK TO USER
    });

    const saved = await transaction.save();
    res.status(201).json(saved);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📜 Get ONLY current user's transactions
export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.query;

    // 🔥 IMPORTANT CHECK
    if (!userId) {
      return res.status(400).json({ message: "User ID missing" });
    }

    const data = await Transaction.find({
      user: userId,
    }).sort({ createdAt: -1 });

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ❌ Delete Transaction (SAFE VERSION)
export const deleteTransaction = async (req, res) => {
  try {
    const { userId } = req.query;

    const transaction = await Transaction.findById(req.params.id);

    // 🔥 CHECK OWNERSHIP
    if (!transaction || transaction.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await transaction.deleteOne();

    res.json({ message: "Transaction deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};