import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;