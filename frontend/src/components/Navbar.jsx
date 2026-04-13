import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login"); // ✅ better than window.location
  };

  return (
    <div className="navbar">
      <p
        className={location.pathname === "/" ? "active" : ""}
        onClick={() => navigate("/")}
      >
        🏠
      </p>

      <p
        className={location.pathname === "/transactions" ? "active" : ""}
        onClick={() => navigate("/transactions")}
      >
        📄
      </p>

      <p
        className={location.pathname === "/analytics" ? "active" : ""}
        onClick={() => navigate("/analytics")}
      >
        📊
      </p>

      <p
        className={location.pathname === "/profile" ? "active" : ""}
        onClick={() => navigate("/profile")}
      >
        👤
      </p>

      {/* ✅ LOGOUT */}
      <p className="logout" onClick={handleLogout}>
        🚪
      </p>
    </div>
  );
};

export default Navbar;