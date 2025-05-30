import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const publicPaths = ["/", "/signup"];
const API_URL = import.meta.env.VITE_BACKEND_URL;

const ProtectedRoute = () => {
  const [isClient, setIsClient] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    setIsClient(true);

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role) {
      setIsValid(false);
      return;
    }

    // Backend API call se token validate karo
    const validateToken = async () => {
      try {
        const res = await fetch(`${API_URL}/validate`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setIsValid(true);
        }

        else {
          setIsValid(false);
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        }
      }

      catch (error) {
        setIsValid(false);
      }
    };

    validateToken();
  }, []);

  if (!isClient || isValid === null) {
    return <div>Loading...</div>;
  }

  if (publicPaths.includes(location.pathname)) {
    if (isValid) {
      return <Navigate to="/home" replace />;
    }
    return <Outlet />;
  }

  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
