import { useEffect, useState } from "react";
import { TarefaUseCase } from "../usecases/TarefaUseCase";

export function TarefaViewModel() {
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState<any | null>(null);
  const [titulo, setTitulo] = useState("");
  const [importancia, setImportancia] = useState("Baixa");
  const [status, setStatus] = useState("Pendente");
  const [ativo, setAtivo] = useState(true);


  const tarefaUseCase = new TarefaUseCase();

  const totalTarefas = tarefas.length;
  const totalAtivas = tarefas.filter((t) => t.ativo === 1).length;
  const totalConcluidas = tarefas.filter((t) => t.status === "concluida").length;

  async function handleListar() {
    try {
      setLoading(true);
      const lista = await tarefaUseCase.listar();
      setTarefas(lista);
    } finally {
      setLoading(false);
    }
  }

  async function handleCriarOuAtualizar(
    titulo: string,
    importancia: string,
    status: string,
    ativo: boolean
  ) {
    try {
      setLoading(true);
      if (modoEdicao && tarefaSelecionada) {
        await tarefaUseCase.atualizar(tarefaSelecionada.id_tarefa, {
          titulo,
          importancia,
          status,
          ativo,
        });
      } else {
        await tarefaUseCase.criar(titulo, importancia, status, ativo, new Date().toISOString());
      }
      setIsModalOpen(false);
      setModoEdicao(false);
      setTarefaSelecionada(null);
      await handleListar();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id: number) {
    try {
      setLoading(true);
      setIsModalOpen(false);
      const response = await tarefaUseCase.excluir(id);
      alert(response?.mensagem || "Tarefa excluida com sucesso!");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
      await handleListar();
    }
  }


  function abrirModalCriacao() {
    setModoEdicao(false);
    setTarefaSelecionada(null);
    setIsModalOpen(true);
    setTitulo("");
    setImportancia("");
    setStatus("");
    setAtivo(true);
    setTarefaSelecionada(null);
  }

  function abrirModalEdicao(tarefa: any) {
    setModoEdicao(true);
    setTarefaSelecionada(tarefa);
    setIsModalOpen(true);
  }




  useEffect(() => {
    handleListar();
  }, []);

  return {
    tarefas,
    loading,
    isModalOpen,
    modoEdicao,
    tarefaSelecionada,
    totalTarefas,
    totalAtivas,
    totalConcluidas,
    abrirModalCriacao,
    abrirModalEdicao,
    handleCriarOuAtualizar,
    setIsModalOpen,
    handleCancel
  };
}
