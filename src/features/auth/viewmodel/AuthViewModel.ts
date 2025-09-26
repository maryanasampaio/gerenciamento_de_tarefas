import { useState } from "react";
import { AuthUseCase } from "../usecases/AuthUseCase";

export function LoginViewModel() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginUseCase = new AuthUseCase();

  async function handleLogin() {
    setLoading(true);
    setError(null);

    try {
      const result = await loginUseCase.execute(usuario, senha);
      if (result) {
        setIsAuthenticated(true);
        alert("Login bem-sucedido, bem vindo(a) " + usuario + "!");
      }
    } catch (err: any) {
      setError(err.message || "Erro inesperado");
      setIsAuthenticated(false);
      alert(err.message)
    } finally {
      setLoading(false);
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
  };
}
