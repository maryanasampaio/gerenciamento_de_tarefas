// src/RouteGuard.tsx
import { JSX } from "react";
import { Navigate } from "react-router-dom";

interface RouteGuardProps {
  children: JSX.Element;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const token = localStorage.getItem("token");

  // se não houver token, redireciona para login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // se houver, renderiza a rota protegida
  return children;
}
