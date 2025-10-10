import { useEffect, useState } from "react";
import { TarefaUseCase } from "../usecases/TarefaUseCase";

export function TarefaViewModel() {
  const [titulo, setTitulo] = useState("");
  const [importancia, setImportancia] = useState("");
  const [status, setStatus] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [dataCriacao, setDataCriacao] = useState("");
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [error, setError] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState<any | null>(null);







  const tarefaUseCase = new TarefaUseCase();

  async function handleCriar(
    titulo: string,
    importancia: string,
    status: string,
    ativo: boolean
  ) {
    try {
      setLoading(true);

      const request = await tarefaUseCase.criar(
        titulo,
        importancia,
        status,
        ativo,
        new Date().toISOString()
      );

      if (request) {
        console.log("Tarefa criada com sucesso!");
        setError(false);
        setLoading(false);
        setIsModalOpen(false);
        await handleListar(); // Atualiza a lista após criar
      } else {
        alert("Erro ao criar tarefa");
        setError(true);
        setLoading(false);
      }
    } catch (error: any) {
      alert("erro: " + error.message);
      setError(true);
      setLoading(false);
    }
  }



  async function handleListar() {
    try {
      setLoading(true);
      const lista = await tarefaUseCase.listar();
      setTarefas(lista);
      setLoading(false);

      if (lista.length === 0) {
        console.log('lista vazia');
        setError(true);
        setLoading(false);
      }

    } catch (error: any) {
      setError(true);
      setLoading(false);
    }
  }


  async function handleAtualizar(
    id_tarefa: number,
    dados: {
      titulo?: string;
      importancia?: string;
      status?: string;
      ativo?: boolean;
    }
  ) {
    try {
      setLoading(true);
      const response = await tarefaUseCase.atualizar(id_tarefa, dados);
      alert(response.mensagem);
      await handleListar();
      setIsModalOpen(false);
      setModoEdicao(false);
      setTarefaSelecionada(null);
    } catch (error: any) {
      alert(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    handleListar();
  }, []);





  return {
    titulo,
    setTitulo,
    importancia,
    setImportancia,
    status,
    setStatus,
    dataCriacao,
    setDataCriacao,
    error,
    loading,
    handleCriar,
    handleListar,
    tarefas,
    isModalOpen,
    setIsModalOpen,
    modoEdicao,
    setModoEdicao,
    tarefaSelecionada,
    setTarefaSelecionada,

  }

} 