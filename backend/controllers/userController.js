import User from "../models/User.js";

// ✅ GET LOGGED-IN USER
export const getUser = async (req, res) => {
  try {
    res.json(req.user); // from auth middleware
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE USERNAME
export const updateUser = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const user = await User.findById(req.user._id);

    user.username = username;
    await user.save();

    res.json({
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE SAVINGS
export const updateBudget = async (req, res) => {
  try {
    const { savings } = req.body;

    if (savings === undefined) {
      return res.status(400).json({ message: "Savings value required" });
    }

    const user = await User.findById(req.user._id);

    user.savings = savings;
    await user.save();

    res.json({ savings: user.savings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};