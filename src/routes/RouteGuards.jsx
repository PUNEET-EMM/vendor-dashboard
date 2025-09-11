import { Navigate, Outlet, useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; 

// Utility to check token validity
const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token); 
    if (!exp) return false;

    const currentTime = Date.now() / 1000;
    return exp > currentTime; 
  } catch {
    return false; 
  }
};

// Custom hook
const useIsAuthenticated = () => {
  const token = localStorage.getItem("Vendortoken");
  return isTokenValid(token);
};

export function RequireAuth() {
  const authed = useIsAuthenticated();
  const location = useLocation();

  if (!authed) {
    localStorage.removeItem("token"); 
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function RedirectIfAuth() {
  const authed = useIsAuthenticated();

  if (authed) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
