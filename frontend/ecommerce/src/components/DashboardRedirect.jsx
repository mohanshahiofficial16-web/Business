import { Navigate } from "react-router-dom";

function DashboardRedirect() {
  // Example: get user role from localStorage or context
  const role = localStorage.getItem("role") || "user";

  if (role === "admin") return <Navigate to="/dashboard/admin" />;
  return <Navigate to="/dashboard/user" />;
}

export default DashboardRedirect;
