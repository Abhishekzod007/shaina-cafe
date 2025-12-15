import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ role: requiredRole, children }) {
  const { role: userRole, loading } = useAuth();

  if (loading) return null; // or a loader component

  if (!userRole) return <Navigate to="/login" replace />;

  if (requiredRole && userRole !== requiredRole) return <Navigate to="/" replace />;
  return children;
}
