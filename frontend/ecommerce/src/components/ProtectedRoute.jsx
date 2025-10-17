// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // or your auth logic

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
