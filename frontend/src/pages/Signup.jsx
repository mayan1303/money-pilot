import { useState } from "react";
import API from "../services/api";
import "./Auth.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const res = await API.post("/auth/signup", {
        username,
        email,
        password,
      });

      // 🔥 CLEAR OLD DATA (IMPORTANT)
      localStorage.removeItem("transactions");
      localStorage.removeItem("income");
      localStorage.removeItem("expense");

      // ✅ SAVE NEW USER
      localStorage.setItem("user", JSON.stringify(res.data));

      // ✅ RESET INPUTS (optional but good)
      setUsername("");
      setEmail("");
      setPassword("");

      // 🚀 REDIRECT TO HOME
      window.location.href = "/";
    } catch {
      alert("Signup failed ❌");
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

        <button onClick={handleSignup}>Signup</button>

        <p onClick={() => (window.location.href = "/login")}>
          Already have an account? Login
        </p>
      </div>
    </div>
  );
};

export default Signup;