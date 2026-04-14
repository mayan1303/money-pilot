import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "./Transactions.css";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 FETCH USER DATA
  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) return;

      const res = await API.get("/transactions", {
        params: { userId: user._id },
      });

      setTransactions(res.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  // 🔥 FIXED DELETE FUNCTION (CLEAN)
  const handleDelete = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("User not found ❌");
        return;
      }

      await API.delete(`/transactions/${id}`, {
        params: { userId: user._id },
      });

      // ✅ Instant UI update
      setTransactions((prev) =>
        prev.filter((t) => t._id !== id)
      );

    } catch (error) {
      console.error("Delete Error:", error.response?.data || error.message);
      alert("Delete failed ❌");
    }
  };

  // 🔥 FILTER
  const filtered =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  const getIcon = (category) => {
    switch (category) {
      case "Food": return "🍔";
      case "Travel": return "✈️";
      case "Shopping": return "🛍️";
      case "Entertainment": return "🎬";
      case "Salary": return "💼";
      case "Pocket Money": return "💰";
      default: return "📌";
    }
  };

  return (
    <div className="transactions-container">

      {/* HEADER */}
      <div className="header-row">
        <h1 className="heading">📄 Transactions</h1>

        <div className="filter-wrapper">
          <div
            className={`filter-btn ${filter}`}
            onClick={() => setShowFilter(!showFilter)}
          >
            {filter.toUpperCase()}
          </div>

          {showFilter && (
            <div className="filter-dropdown">
              <p onClick={() => { setFilter("all"); setShowFilter(false); }}>All</p>
              <p onClick={() => { setFilter("income"); setShowFilter(false); }}>Income</p>
              <p onClick={() => { setFilter("expense"); setShowFilter(false); }}>Expense</p>
            </div>
          )}
        </div>
      </div>

      {/* LIST */}
      {filtered.map((t) => (
        <div key={t._id} className="transaction-card">

          <div className="left">
            <h3>{getIcon(t.category)} {t.title}</h3>

            <p className={t.type === "income" ? "green" : "red"}>
              ₹{t.amount}
            </p>

            <p className="category">{t.category}</p>

            <small>
              {new Date(t.createdAt).toLocaleString()}
            </small>
          </div>

          <div className="right">
            <button onClick={() => handleDelete(t._id)}>
              Delete
            </button>
          </div>

        </div>
      ))}

      <Navbar />
    </div>
  );
};

export default Transactions;