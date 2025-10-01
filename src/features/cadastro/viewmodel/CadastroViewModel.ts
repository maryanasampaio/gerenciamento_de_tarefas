import { useState } from "react";
import { CadastroUseCase } from "../usecases/CadastroUseCase";
import { useNavigate } from "react-router-dom";

export function CadastroViewModel() {
  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean | null>(null);


  const cadastroUseCase = new CadastroUseCase();
  const navigate = useNavigate();


  async function handleListar() {
    setLoading(true);
    setError(null);
    try {
      const response = await cadastroUseCase.listar();
      if (response) {
        setError(false);
        console.log(response);
      }
    } catch (error: any) {
      setError(true);
      console.log(error.message);
    }

  }
  async function handleCadastro() {
    setLoading(true);
    setError(null);
    try {
      const response = await cadastroUseCase.criar(nome, usuario, email, senha);
      if (response) {
        setError(false);
        alert('Usuário criado com sucesso!');
        // navigate('/login');
        handleListar();

      }
    } catch (error: any) {
      setError(true);
      alert(error.message);
      navigate('/cadastro');
    } finally {
      setLoading(false);
    }
  }

  return {
    nome,
    setNome,
    usuario,
    setUsuario,
    email,
    setEmail,
    senha,
    setSenha,
    loading,
    error,
    handleCadastro,
  }
}
