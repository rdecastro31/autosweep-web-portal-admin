import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userlevel = user.userlevel || "";

  // 🔒 Not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 🔒 Role restriction
  if (allowedRoles.length > 0 && !allowedRoles.includes(userlevel)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;