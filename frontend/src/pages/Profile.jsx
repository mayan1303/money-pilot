import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "./Profile.css";

const Profile = () => {
  const { savings, updateSavings } = useContext(AppContext);

  const [userData, setUserData] = useState({});
  const [edit, setEdit] = useState(false);
  const [newName, setNewName] = useState("");
  const [inputSavings, setInputSavings] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
    fetchUser();
  }, []);

  useEffect(() => {
    setInputSavings(savings);
  }, [savings]);

  // ✅ FETCH USER TRANSACTIONS
  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      const res = await API.get(`/transactions?userId=${user._id}`);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FETCH USER FROM LOCAL STORAGE
  const fetchUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    setUserData(user);
    setNewName(user.username);
  };

  // ✅ UPDATE NAME
  const handleNameUpdate = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await API.put("/user/update", {
        userId: user._id,
        username: newName,
      });

      localStorage.setItem("user", JSON.stringify(res.data));
      setUserData(res.data);
      setEdit(false);

    } catch {
      alert("Update failed ❌");
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

  // ✅ FIXED SAVE FUNCTION
  const handleSave = async () => {
    if (!inputSavings) return;

    try {
      setLoading(true);

      await updateSavings(Number(inputSavings)); // 🔥 IMPORTANT FIX

      alert("Savings updated ✅"); // optional feedback

    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">

      <h1 className="page-title">Profile</h1>

      {/* PROFILE CARD */}
      <div className="profile-card glass">
        <div className="profile-left">
          <span className="avatar">👤</span>

          <div>
            {edit ? (
              <div className="edit-row">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button onClick={handleNameUpdate}>Save</button>
              </div>
            ) : (
              <>
                <h2 className="username">{userData.username}</h2>
                <p className="email">{userData.email}</p>
              </>
            )}
          </div>
        </div>

        {!edit && (
          <button className="edit-btn" onClick={() => setEdit(true)}>
            ✏️
          </button>
        )}
      </div>

      {/* SAVINGS */}
      <div className="savings-card">
        <div>
          <h3>💰 Savings Goal</h3>

          <div className="savings-input">
            <input
              type="number"
              value={inputSavings}
              onChange={(e) => setInputSavings(e.target.value)}
            />

            <button onClick={handleSave} disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>

        <h2>₹{savings}</h2>
      </div>

      {/* STATS */}
      <div className="stats-grid">

        <div className="card income hover">
          <p>🟢 Income</p>
          <h3>₹{income}</h3>
        </div>

        <div className="card expense hover">
          <p>🔴 Expense</p>
          <h3>₹{expense}</h3>
        </div>

        <div className="card balance hover">
          <p>🔵 Balance</p>
          <h3>₹{balance}</h3>
        </div>

        <div className="card budget hover">
          <p>🟣 Budget</p>
          <h3>₹{budgetLeft}</h3>
        </div>

      </div>

      <Navbar />
    </div>
  );
};

export default Profile;