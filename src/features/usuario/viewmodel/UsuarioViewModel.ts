import { useEffect, useState } from "react";
import { UsuarioUseCase } from "../usecases/UsuarioUseCase";
import { useNavigate } from "react-router-dom";

export function UsuarioViewModel() {
  const [idUsuario, setIdUsuario] = useState<number | null>(null);

  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean | null>(null);


  const usuarioUseCase = new UsuarioUseCase();
  const navigate = useNavigate();




  async function carregarUsuarioAutenticado() {
    try {
      setLoading(true);
      const dados = await usuarioUseCase.buscarUsuarioAutenticado();

      setIdUsuario(dados.id_usuario);
      setNome(dados.nome_completo);
      setUsuario(dados.usuario);
      setEmail(dados.email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }




  async function handleCadastro() {
    setLoading(true);
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nome || !usuario || !email || !senha) {
      alert("Todos os campos são obrigatórios.");
      setLoading(false);
      return;
    }

    if (!emailRegex.test(email)) {
      alert("Formato de e-mail inválido.");
      setLoading(false);
      return;
    }

    try {
      const response = await usuarioUseCase.criar(nome, usuario, email, senha);
      if (response) {
        setError(false);
        alert('Usuário criado com sucesso!');
        setLoading(true);
        navigate('/login');
      }
    } catch (error: any) {
      setError(true);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAtualizarUsuario() {
    if (!idUsuario) return;

    try {
      setLoading(true);
      await usuarioUseCase.atualizarUsuario(idUsuario, {
        nome_completo: nome,
        usuario,
        email,
        senha: senha || undefined,
      });
      alert("Usuário atualizado com sucesso!");
      navigate('/pagina-inicial');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarUsuarioAutenticado();
  }, []);

  async function handleCancelCadastro() {
    setLoading(true);
    setError(null);
    navigate('/login');
  }

  async function handleCancelAtualizacao() {
    setLoading(true);
    setError(null);
    navigate('/pagina-inicial');

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
    handleCancelCadastro,
    handleCancelAtualizacao,
    handleAtualizarUsuario,
    carregarUsuarioAutenticado,
    idUsuario
  }
}
