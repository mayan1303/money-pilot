import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // 🔴 validation
    if (!username || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // 🧹 CLEAR OLD USER (IMPORTANT FIX)
      localStorage.removeItem("user");

      const res = await API.post("/auth/signup", {
        username,
        email,
        password,
      });

      // ✅ SAVE NEW USER
      localStorage.setItem("user", JSON.stringify(res.data));

      // 🧼 reset fields
      setUsername("");
      setEmail("");
      setPassword("");

      // 🚀 redirect (no reload)
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Money Pilot</h1>

      <div className="auth-card">
        <h2>Signup</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

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

        <button onClick={handleSignup} disabled={loading}>
          {loading ? "Creating..." : "Signup"}
        </button>

        <p onClick={() => navigate("/login")}>
          Already have an account? Login
        </p>
      </div>
    </div>
  );
};

export default Signup;