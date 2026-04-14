import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";
import "./Home.css";

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const { savings } = useContext(AppContext);

  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 FETCH USER-SPECIFIC DATA
  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) return;

      const res = await API.get(`/transactions?userId=${user._id}`);
      setTransactions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 ADD TRANSACTION WITH USER ID
  const handleSubmit = async () => {
    if (!title || !amount || !category) {
      alert("Fill all fields");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await API.post("/transactions", {
        title,
        amount: Number(amount),
        category,
        type,
        userId: user._id, // 🔥 IMPORTANT
      });

      setShowForm(false);
      setTitle("");
      setAmount("");
      setCategory("");

      fetchData();
    } catch (error) {
      console.error("ERROR:", error.response?.data || error.message);
    }
  };

  // 📊 CALCULATIONS
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;
  const budgetLeft = balance - savings;

  return (
    <div className="container">
      <h1 className="title">✈️ Money Pilot</h1>

      {/* MAIN CARD */}
      <div className="main-card">

        {/* LEFT */}
        <div className="left">
          <p className="income">Income: ₹{income}</p>
          <p className="expense">Expense: ₹{expense}</p>
        </div>

        {/* CENTER */}
        <div className="center">
          <div className="balance-box">
            <h1 className="balance">₹{balance}</h1>
            <p className="label">Balance</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right">
          <p>💰 Savings: ₹{savings}</p>
          <p>📊 Budget Left: ₹{budgetLeft}</p>
        </div>

      </div>

      {/* BUTTONS */}
      <div className="btn-group">
        <button
          className="income-btn"
          onClick={() => {
            setShowForm(true);
            setType("income");
          }}
        >
          + Add Income
        </button>

        <button
          className="expense-btn"
          onClick={() => {
            setShowForm(true);
            setType("expense");
          }}
        >
          - Add Expense
        </button>
      </div>

      {/* POPUP */}
      {showForm && (
        <div className="popup">
          <div className="form">
            <h2>Add {type}</h2>

            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>

              {type === "income" ? (
                <>
                  <option>Salary</option>
                  <option>Pocket Money</option>
                  <option>Freelance</option>
                  <option>Business</option>
                  <option>Investment</option>
                  <option>Other</option>
                </>
              ) : (
                <>
                  <option>Food</option>
                  <option>Travel</option>
                  <option>Shopping</option>
                  <option>Entertainment</option>
                  <option>Health</option>
                  <option>Education</option>
                  <option>Bills</option>
                  <option>Other</option>
                </>
              )}
            </select>

            <button onClick={handleSubmit}>Save</button>
            <button onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
};

export default Home;