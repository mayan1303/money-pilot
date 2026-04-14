import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 🔴 validation
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // 🧹 CLEAR OLD DATA (VERY IMPORTANT FIX)
      localStorage.removeItem("user");

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // ✅ SAVE NEW USER
      localStorage.setItem("user", JSON.stringify(res.data));

      // 🔄 redirect
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Money Pilot</h1>

      <div className="auth-card">
        <h2>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p onClick={() => navigate("/signup")}>
          Don’t have an account? Signup
        </p>
      </div>
    </div>
  );
};

export default Login;