import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import "./ProtectedRoute.scss";

function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait until AuthContext finishes checking localStorage/token
  if (loading) {
    return (
      <div className="protected-route-loading">
        <div className="protected-route-loading__spinner"></div>
        <p>Loading Projectly...</p>
      </div>
    );
  }

  // User is not logged in
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // User is authenticated
  return <Outlet />;
}

export default ProtectedRoute;