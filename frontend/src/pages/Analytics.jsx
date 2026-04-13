import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

import "./Analytics.css";

const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b", "#a855f7"];

const Analytics = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // 💰 Income vs Expense
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const barData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  // 🥧 Category-wise Expense
  const categoryData = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryData[t.category] =
        (categoryData[t.category] || 0) + t.amount;
    });

  const pieData = Object.keys(categoryData).map((key) => ({
    name: key,
    value: categoryData[key],
  }));

  // 📈 Trend Graph
  const trendMap = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const date = new Date(t.createdAt).toLocaleDateString();
      trendMap[date] = (trendMap[date] || 0) + t.amount;
    });

  const trendData = Object.keys(trendMap).map((date) => ({
    date,
    amount: trendMap[date],
  }));

  return (
    <div className="analytics-container">
      <h1 className="heading">📊 Analytics</h1>

      {/* 🔹 BAR CHART */}
      <div className="chart-card">
        <h3>Income vs Expense</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip formatter={(value) => `₹${value}`} />
            <Bar dataKey="value">
              {barData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.name === "Income" ? "#22c55e" : "#ef4444"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🔹 PIE CHART (FIXED CLEAN VERSION) */}
      <div className="chart-card">
        <h3>Expenses by Category</h3>

        {pieData.length === 0 ? (
          <p>No expense data</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={100}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              {/* ✅ Only show on hover */}
              <Tooltip
                formatter={(value, name) => [`₹${value}`, name]}
              />

              {/* Optional legend */}
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 🔹 TREND GRAPH */}
      <div className="chart-card">
        <h3>Spending Trend</h3>

        {trendData.length === 0 ? (
          <p>No data</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="date" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <Navbar />
    </div>
  );
};

export default Analytics;