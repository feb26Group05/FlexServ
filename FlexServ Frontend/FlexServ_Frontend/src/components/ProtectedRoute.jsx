import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const storedRole = localStorage.getItem("userRole");
  const storedUser = localStorage.getItem("user");

  const effectiveRole = user?.role || storedRole;
  const isAuth = isAuthenticated || !!storedUser || !!storedRole;

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && effectiveRole !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
