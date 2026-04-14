import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (err) {
    user = null;
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;