import { useState } from "react";
import { AuthUseCase } from "../usecases/AuthUseCase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function LoginViewModel() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, logout, checkAuth } = useAuth();

  const loginUseCase = new AuthUseCase();
  const navigate = useNavigate();

  async function handleLogin() {
    setLoading(true);
    setError(null);
    try {
      // 1️⃣ faz login no backend (gera o cookie)
      await loginUseCase.execute(usuario, senha);

      // 2️⃣ checa se o cookie está válido e atualiza o contexto
      const ok = await checkAuth();

      if (!ok) {
        throw new Error("Falha ao autenticar sessão");
      }
      // Não navegar aqui - deixar o LoginView controlar
    } catch (err: any) {
      setError(err.message || "Erro inesperado");
      throw err; // Re-throw para o LoginView capturar
    } finally {
      setLoading(false);
    }
  }



  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error: any) {
      setError(error.mensagem || "Erro ao fazer logout");
    }
  }

  return {
    usuario,
    setUsuario,
    senha,
    setSenha,
    loading,
    error,
    handleLogin,
    handleLogout,
  };
}
