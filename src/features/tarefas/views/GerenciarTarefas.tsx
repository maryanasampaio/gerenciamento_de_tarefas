import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useState, useEffect } from "react";
import {
  Circle,
  Loader2,
  CheckCircle2,
  Plus,
  SquarePen,
  Search,
  Clock,
  ListTodo,
  CheckCheck
} from "lucide-react";
import { Modal } from "../components/Modal";
import { TarefaViewModel } from "../viewmodel/TarefaViewModel";
import RoundCheckbox from "../components/CheckBox";
import { ImportanciaBadge } from "../components/ImportanciaBadge";

export const GerenciarTarefas: React.FC = () => {
  const {
    tarefas,
    loading,
    isModalOpen,
    setIsModalOpen,
    modoEdicao,
    tarefaSelecionada,
    handleCriarOuAtualizar,
    abrirModalCriacao,
    abrirModalEdicao,
    handleCancel,
    handleConcluirTarefa,
  } = TarefaViewModel();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filtroAtivo, setFiltroAtivo] = useState<"todas" | "pendentes" | "andamento" | "concluidas">("todas");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const tarefasFiltradas = tarefas.filter(tarefa => {
    if (filtroAtivo === "todas") return true;
    if (filtroAtivo === "pendentes") return tarefa.status === "pendente";
    if (filtroAtivo === "andamento") return tarefa.status === "andamento";
    if (filtroAtivo === "concluidas") return tarefa.status === "concluida";
    return true;
  });

  // Ordenar tarefas filtradas por importância (alta, média, baixa)
  const tarefasOrdenadas = [...tarefasFiltradas].sort((a, b) => {
    const prioridades = { alta: 1, media: 2, baixa: 3 };
    const prioridadeA = prioridades[a.importancia as keyof typeof prioridades] || 4;
    const prioridadeB = prioridades[b.importancia as keyof typeof prioridades] || 4;
    
    // Se a prioridade for diferente, ordenar por prioridade
    if (prioridadeA !== prioridadeB) {
      return prioridadeA - prioridadeB;
    }
    
    // Se a prioridade for igual, ordenar por ID (mais recente primeiro)
    return (b.id_tarefa || 0) - (a.id_tarefa || 0);
  });

  const totalTarefas = tarefas.length;
  const tarefasConcluidas = tarefas.filter(t => t.status === "concluida").length;
  const tarefasPendentes = tarefas.filter(t => t.status === "pendente").length;
  const tarefasAndamento = tarefas.filter(t => t.status === "andamento").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 relative overflow-hidden">
      {/* Background com ícones animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div 
          className="absolute text-cyan-300/30 dark:text-cyan-600/20"
          style={{
            left: `${mousePos.x * 0.02}px`,
            top: `${mousePos.y * 0.02}px`,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.3s ease-out'
          }}
        >
          <CheckCircle2 className="h-32 w-32" strokeWidth={1} />
        </div>
        <div 
          className="absolute text-blue-300/30 dark:text-blue-600/20"
          style={{
            right: `${mousePos.x * 0.01}px`,
            top: `${mousePos.y * 0.03}px`,
            transform: 'translate(50%, -50%)',
            transition: 'all 0.4s ease-out'
          }}
        >
          <ListTodo className="h-40 w-40" strokeWidth={1} />
        </div>
        <div 
          className="absolute text-indigo-300/30 dark:text-indigo-600/20"
          style={{
            left: `${mousePos.x * 0.015}px`,
            bottom: `${mousePos.y * 0.02}px`,
            transform: 'translate(-50%, 50%)',
            transition: 'all 0.35s ease-out'
          }}
        >
          <Clock className="h-36 w-36" strokeWidth={1} />
        </div>
        <div 
          className="absolute text-teal-300/30 dark:text-teal-600/20"
          style={{
            right: `${mousePos.x * 0.025}px`,
            bottom: `${mousePos.y * 0.015}px`,
            transform: 'translate(50%, 50%)',
            transition: 'all 0.45s ease-out'
          }}
        >
          <CheckCheck className="h-44 w-44" strokeWidth={1} />
        </div>
      </div>

      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-20"
        } p-6 md:p-8 relative z-10`}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Minhas Tarefas
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gerencie suas atividades e acompanhe o progresso
            </p>
          </div>
          <Button
            onClick={abrirModalCriacao}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 h-11 px-6"
          >
            <Plus className="mr-2 h-5 w-5" />
            Nova Tarefa
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Total
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {totalTarefas}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <ListTodo className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Pendentes
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {tarefasPendentes}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Circle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-cyan-500 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Em Andamento
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {tarefasAndamento}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Concluídas
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {tarefasConcluidas}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filtroAtivo === "todas" ? "default" : "outline"}
                size="sm"
                onClick={() => setFiltroAtivo("todas")}
                className={filtroAtivo === "todas" ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white" : ""}
              >
                Todas
              </Button>
              <Button
                variant={filtroAtivo === "pendentes" ? "default" : "outline"}
                size="sm"
                onClick={() => setFiltroAtivo("pendentes")}
                className={filtroAtivo === "pendentes" ? "bg-amber-600 hover:bg-amber-700 text-white" : ""}
              >
                Pendentes
              </Button>
              <Button
                variant={filtroAtivo === "andamento" ? "default" : "outline"}
                size="sm"
                onClick={() => setFiltroAtivo("andamento")}
                className={filtroAtivo === "andamento" ? "bg-cyan-600 hover:bg-cyan-700 text-white" : ""}
              >
                Em Andamento
              </Button>
              <Button
                variant={filtroAtivo === "concluidas" ? "default" : "outline"}
                size="sm"
                onClick={() => setFiltroAtivo("concluidas")}
                className={filtroAtivo === "concluidas" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
              >
                Concluídas
              </Button>
            </div>

            {/* Search */}
            <div className="flex-1 relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar tarefas..."
                className="pl-10 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700"
              />
            </div>
          </div>
        </Card>

        {/* Tasks List */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
            </div>
          ) : tarefasOrdenadas.length === 0 ? (
            <Card className="p-12 text-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
              <div className="flex flex-col items-center justify-center">
                <ListTodo className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {filtroAtivo === "todas"
                    ? "Nenhuma tarefa encontrada"
                    : `Nenhuma tarefa ${filtroAtivo}`}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Comece criando sua primeira tarefa
                </p>
              </div>
            </Card>
          ) : (
            tarefasOrdenadas.map((tarefa) => (
              <Card
                key={tarefa.id_tarefa}
                className="p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-l-4"
                style={{
                  borderLeftColor:
                    tarefa.status === "concluida"
                      ? "rgb(16, 185, 129)"
                      : tarefa.status === "andamento"
                      ? "rgb(6, 182, 212)"
                      : "rgb(251, 191, 36)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <RoundCheckbox
                      checked={tarefa.status === "concluida"}
                      onChange={() => handleConcluirTarefa(tarefa.id_tarefa, tarefa.status)}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-semibold ${
                            tarefa.status === "concluida"
                              ? "line-through text-gray-400 dark:text-gray-500"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {tarefa.titulo}
                        </h3>
                        <p
                          className={`text-sm mt-1 ${
                            tarefa.status === "concluida"
                              ? "line-through text-gray-400 dark:text-gray-500"
                              : "text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {tarefa.descricao}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <ImportanciaBadge nivel={tarefa.importancia as "baixa" | "media" | "alta"} />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => abrirModalEdicao(tarefa)}
                          className="h-9 w-9 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-900/30"
                        >
                          <SquarePen className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{tarefa.data}</span>
                      </div>
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tarefa.status === "concluida"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : tarefa.status === "andamento"
                            ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}
                      >
                        {tarefa.status === "concluida"
                          ? "Concluída"
                          : tarefa.status === "andamento"
                          ? "Em Andamento"
                          : "Pendente"}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={(dados) => handleCriarOuAtualizar(dados.titulo, dados.importancia, dados.status, dados.ativo)}
        modoEdicao={modoEdicao}
        tarefa={tarefaSelecionada}
      />
    </div>
  );
};
