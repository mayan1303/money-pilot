import User from "../models/User.js";

// ✅ GET LOGGED-IN USER (FIXED)
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.json(user); // 🔥 now includes savings
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE USERNAME (FIXED RESPONSE)
export const updateUser = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username },
      { new: true }
    ).select("-password");

    res.json(user); // 🔥 return full user (important)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE SAVINGS (FIXED)
export const updateBudget = async (req, res) => {
  try {
    const { savings } = req.body;

    if (savings === undefined) {
      return res.status(400).json({ message: "Savings value required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { savings: Number(savings) }, // 🔥 force number
      { new: true }
    ).select("-password");

    res.json(user); // 🔥 return full user
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};