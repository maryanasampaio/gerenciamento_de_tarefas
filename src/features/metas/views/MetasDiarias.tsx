import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TarefaViewModel } from "@/features/tarefas/viewmodel/TarefaViewModel";
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  Circle,
  Target,
  TrendingUp,
  Clock
} from "lucide-react";

export const MetasDiarias: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const location = useLocation();
  const { tarefas } = TarefaViewModel();

  // Obter data da URL ou usar data atual
  const searchParams = new URLSearchParams(location.search);
  const dataUrl = searchParams.get('data');
  
  const getDataSelecionada = () => {
    if (dataUrl) {
      // Formato: DD/MM/YYYY
      const [dia, mes, ano] = dataUrl.split('/');
      return new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
    }
    return new Date();
  };

  const dataSelecionada = getDataSelecionada();
  
  // Verificar se é hoje
  const hoje = new Date();
  const isHoje = dataSelecionada.toLocaleDateString('pt-BR') === hoje.toLocaleDateString('pt-BR');
  
  const tituloData = isHoje 
    ? "Hoje" 
    : dataSelecionada.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

  // Mostrar informação da data selecionada
  const infoData = dataSelecionada.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Filtrar tarefas do dia selecionado
  const tarefasDoDia = tarefas.filter(tarefa => {
    if (!tarefa.data) return false;
    const tarefaDate = tarefa.data.includes('/') 
      ? tarefa.data 
      : new Date(tarefa.data).toLocaleDateString('pt-BR');
    const dataFormatada = dataSelecionada.toLocaleDateString('pt-BR');
    return tarefaDate === dataFormatada;
  });

  // Ordenar tarefas por importância (alta, média, baixa)
  const tarefasOrdenadas = [...tarefasDoDia].sort((a, b) => {
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
          <CalendarDays className="h-32 w-32" strokeWidth={1} />
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
          <Target className="h-40 w-40" strokeWidth={1} />
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
          <TrendingUp className="h-36 w-36" strokeWidth={1} />
        </div>
      </div>

      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-20"
        } p-6 md:p-8 relative z-10`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {isHoje ? "Tarefas de Hoje" : `Metas Diárias do dia ${tituloData}`}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {infoData}
            </p>
          </div>
          <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 h-11 px-6">
            <Plus className="mr-2 h-5 w-5" />
            Nova Meta
          </Button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Total Hoje
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {tarefasDoDia.length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
                  {tarefasDoDia.filter(t => t.status === 'concluida').length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Em Progresso
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {tarefasDoDia.filter(t => t.status === 'andamento').length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Texto Explicativo */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 backdrop-blur-sm border-l-4 border-l-blue-500">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Clique em uma meta</strong> para definir as tarefas específicas que te levarão até ela. 🎯
              </p>
            </div>
          </div>
        </Card>

        {/* Lista de Tarefas do Dia */}
        {tarefasDoDia.length === 0 ? (
          <Card className="p-12 text-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center">
              <CalendarDays className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Nenhuma tarefa para este dia
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Clique em "Nova Meta" para adicionar tarefas
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                Tarefas para Alcançar suas Metas
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {tarefasOrdenadas.length} {tarefasOrdenadas.length === 1 ? 'tarefa' : 'tarefas'}
              </span>
            </div>
            {tarefasOrdenadas.map((tarefa) => (
              <Card 
                key={tarefa.id_tarefa} 
                className="p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-l-4"
                style={{
                  borderLeftColor: 
                    tarefa.status === "concluida"
                      ? "rgb(16, 185, 129)"
                      : tarefa.status === "andamento"
                      ? "rgb(6, 182, 212)"
                      : "rgb(251, 191, 36)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {tarefa.status === 'concluida' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      ) : tarefa.status === 'andamento' ? (
                        <Clock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      )}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {tarefa.titulo}
                      </h3>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 ml-8 mb-3">
                      {tarefa.descricao}
                    </p>
                    
                    <div className="flex items-center gap-4 ml-8">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        tarefa.status === "concluida"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : tarefa.status === "andamento"
                          ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}>
                        {tarefa.status === "concluida"
                          ? "Concluída"
                          : tarefa.status === "andamento"
                          ? "Em Andamento"
                          : "Pendente"}
                      </span>
                      
                      {tarefa.importancia && (
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          tarefa.importancia === "alta"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                            : tarefa.importancia === "media"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                        }`}>
                          {tarefa.importancia === "alta"
                            ? "Alta Prioridade"
                            : tarefa.importancia === "media"
                            ? "Média Prioridade"
                            : "Baixa Prioridade"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
