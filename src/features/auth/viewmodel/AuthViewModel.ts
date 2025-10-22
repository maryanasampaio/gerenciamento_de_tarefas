import { useState } from "react";
import { AuthUseCase } from "../usecases/AuthUseCase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // 👈

export function LoginViewModel() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const loginUseCase = new AuthUseCase();
  const navigate = useNavigate();

  async function handleLogin() {
    setLoading(true);
    setError(null);

    try {
      await loginUseCase.execute(usuario, senha);
      setIsAuthenticated(true);
      navigate("/pagina-inicial");
    } catch (err: any) {
      setError(err.message || "Erro inesperado");
      setIsAuthenticated(false);
      alert(err.message);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }


  async function handleCadastro() {
    navigate("/cadastro");
  }

  async function handleLogout() {
    try {
      await loginUseCase.logout();
      setIsAuthenticated(false);
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
    isAuthenticated,
    handleLogin,
    handleCadastro,
    handleLogout,
  };
}
