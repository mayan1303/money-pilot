import { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [savings, setSavings] = useState(0);

  // ✅ fetch user (not /savings now)
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await API.get("/user");
      setSavings(res.data.savings);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ update via /budget
  const updateSavings = async (value) => {
    try {
      const res = await API.put("/user/budget", {
        savings: Number(value),
      });
      setSavings(res.data.savings);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AppContext.Provider value={{ savings, updateSavings }}>
      {children}
    </AppContext.Provider>
  );
};