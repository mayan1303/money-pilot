import { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [savings, setSavings] = useState(0);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user._id) return;

    const res = await API.get("/user");
setSavings(res.data.savings || 0);

    // 🔥 Important fallback fix
    if (res.data && res.data.savings !== undefined) {
      setSavings(res.data.savings);
    } else {
      setSavings(0);
    }

  } catch (err) {
    console.error("Fetch User Error:", err);

    // ❌ DO NOT reset to 0 on error (this was your bug)
    // keep previous savings instead
  }
};

  // ✅ CORRECT: NO userId needed
  const updateSavings = async (value) => {
    try {
      const res = await API.put("/user/budget", {
        savings: Number(value), // 🔥 IMPORTANT
      });

      setSavings(res.data.savings); // instant UI update
    } catch (err) {
      console.log("Update Savings Error:", err);
    }
  };

  return (
    <AppContext.Provider value={{ savings, updateSavings }}>
      {children}
    </AppContext.Provider>
  );
};