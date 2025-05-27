import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const publicPaths = ["/", "/signup"];

const ProtectedRoute = () => {
  const [isClient, setIsClient] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (publicPaths.includes(location.pathname)) {
    if (token && role) {
      return <Navigate to="/home" replace />;
    }
    return <Outlet />;
  }

  if (!token || !role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
