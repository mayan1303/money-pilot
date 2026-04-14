import { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [savings, setSavings] = useState(0);

  useEffect(() => {
    fetchUser();
  }, []);

  // ✅ CORRECT: NO userId in URL
  const fetchUser = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      const res = await API.get("/user"); // 🔥 FIXED

      setSavings(res.data.savings || 0);
    } catch (err) {
      console.log("Fetch User Error:", err);
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