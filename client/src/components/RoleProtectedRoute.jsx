import { Navigate } from "react-router-dom";

function RoleProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== role) {
    return <Navigate to="/auctions" replace />;
  }

  return children;
}

export default RoleProtectedRoute;