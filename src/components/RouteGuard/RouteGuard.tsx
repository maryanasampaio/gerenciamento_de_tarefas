import { JSX, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface RouteGuardProps {
  children: JSX.Element;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, checkAuth } = useAuth();

  // Garante que o cookie é checado ao montar o guard
  useEffect(() => {
    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
