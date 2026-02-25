import { useEffect, useState } from "react";
import { TarefaUseCase } from "../usecases/TarefaUseCase";
import { useModal } from "@/context/ModalContext";

export function TarefaViewModel() {
  const modal = useModal();
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState<any | null>(null);
  const [titulo, setTitulo] = useState("");
  const [importancia, setImportancia] = useState("Baixa");
  const [status, setStatus] = useState("Pendente");
  const [ativo, setAtivo] = useState(true);
  const [termo, setTermo] = useState("");



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
          status: status === "em_andamento" ? "andamento" : status,
          ativo,
        });
      } else {
        await tarefaUseCase.criar(
          titulo,
          importancia,
          status === "em_andamento" ? "andamento" : status,
          ativo,
          new Date().toISOString()
        );
      }
      
      setIsModalOpen(false);
      setModoEdicao(false);
      setTarefaSelecionada(null);
      await handleListar();
    } catch (error: any) {
      modal.error(
        modoEdicao ? "Erro ao atualizar" : "Erro ao criar",
        error.message || "Tente novamente"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id: number) {
    try {
      setLoading(true);
      setIsModalOpen(false);
      await tarefaUseCase.excluir(id);
    } catch (error: any) {
      modal.error("Erro ao excluir", error.message || "Tente novamente");
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

  async function handleConcluirTarefa(id_tarefa: number, statusAtual: string) {
    try {
      setLoading(true);

      // alterna o status
      const novoStatus = statusAtual === "concluida" ? "pendente" : "concluida";

      await tarefaUseCase.atualizar(id_tarefa, { status: novoStatus });

      // Atualiza o estado local para refletir a mudança sem refazer o GET
      setTarefas((prev) =>
        prev.map((t) =>
          t.id_tarefa === id_tarefa ? { ...t, status: novoStatus } : t
        )
      );
      
    } catch (error: any) {
      modal.error("Erro ao atualizar", error.message || "Tente novamente");
    } finally {
      setLoading(false);
    }
  }

  async function handlePesquisar() {
    setLoading(true);

    try {
      const tarefas = await tarefaUseCase.buscarTarefa(termo);
      if (tarefas) {
        setTarefas(tarefas);
        setError(false);
      }
      setLoading(false);
    } catch (error: any) {
      setError(true);
      setLoading(false);
      alert(error.message);
    }
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
    handleCancel,
    handleConcluirTarefa,
    termo,
    setTermo,
    handlePesquisar,
  };
}
