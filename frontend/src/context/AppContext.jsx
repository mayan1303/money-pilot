import { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [savings, setSavings] = useState(0);

  useEffect(() => {
    fetchUser();
  }, []);

  // 🔥 FETCH USER WITH USER ID
  const fetchUser = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) return;

      const res = await API.get(`/user/${user._id}`); // ✅ FIXED

      setSavings(res.data.savings || 0);
    } catch (err) {
      console.log("Fetch User Error:", err);
    }
  };

  // 🔥 UPDATE SAVINGS WITH USER ID
  const updateSavings = async (value) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) return;

      const res = await API.put(`/user/budget/${user._id}`, {
        savings: Number(value),
      }); // ✅ FIXED

      setSavings(res.data.savings);
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