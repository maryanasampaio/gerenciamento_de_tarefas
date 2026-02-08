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
      const response = await loginUseCase.execute(usuario, senha);
      await login(response.usuario);
    } catch (err: any) {
      setError(err.message || "Erro inesperado");
      throw err;
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
