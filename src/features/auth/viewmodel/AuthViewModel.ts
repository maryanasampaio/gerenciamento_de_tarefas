import { useState } from "react";
import { AuthUseCase } from "../usecases/AuthUseCase";
import { useNavigate } from "react-router-dom";

export function LoginViewModel() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginUseCase = new AuthUseCase();

  const navigate = useNavigate();

  async function handleLogin() {
    setLoading(true);
    setError(null);

    try {
      const result = await loginUseCase.execute(usuario, senha);
      if (result?.usuario) {

      }
      setIsAuthenticated(true);
      navigate('/pagina-inicial');
    } catch (err: any) {
      setError(err.message || "Erro inesperado");
      setIsAuthenticated(false);
      alert(err.message)
      navigate('/login');

    } finally {
      setLoading(false);
    }
  }

  async function handleCadastro() {
    navigate('/cadastro');
  }

  async function handleLogout() {
    try {
      await loginUseCase.logout();
      navigate('/login');
      setIsAuthenticated(false);
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
    handleLogout
  };
}
