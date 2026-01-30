import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TarefaViewModel } from "../viewmodel/TarefaViewModel";
import {
  CalendarDays,
  Calendar,
  CalendarRange,
  ListTodo,
  Circle,
  Sparkles,
  Moon,
  Sun
} from "lucide-react";

export const PaginaInicial: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tarefas } = TarefaViewModel();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [modoEscuro, setModoEscuro] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
      document.documentElement.classList.add('dark');
      setModoEscuro(true);
    }
  }, []);

  const toggleModoEscuro = () => {
    const novoModo = !modoEscuro;
    setModoEscuro(novoModo);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', novoModo.toString());
  };

  // Função para ordenar tarefas por importância
  const ordenarPorImportancia = (tarefasList: any[]) => {
    const prioridades = { alta: 1, media: 2, baixa: 3 };
    return [...tarefasList].sort((a, b) => {
      const prioridadeA = prioridades[a.importancia as keyof typeof prioridades] || 4;
      const prioridadeB = prioridades[b.importancia as keyof typeof prioridades] || 4;
      
      // Se a prioridade for diferente, ordenar por prioridade
      if (prioridadeA !== prioridadeB) {
        return prioridadeA - prioridadeB;
      }
      
      // Se a prioridade for igual, ordenar por ID (mais recente primeiro)
      return (b.id_tarefa || 0) - (a.id_tarefa || 0);
    });
  };

  // Tarefas recentes (máximo 4) ordenadas por importância
  const tarefasRecentes = ordenarPorImportancia(tarefas).slice(0, 4);

  // Funções do calendário
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  // Contar tarefas por dia
  const getTarefasPorDia = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateStr = `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;
    
    return tarefas.filter(tarefa => {
      if (!tarefa.data) return false;
      // Aceita formato DD/MM/YYYY ou YYYY-MM-DD
      const tarefaDate = tarefa.data.includes('/') 
        ? tarefa.data 
        : new Date(tarefa.data).toLocaleDateString('pt-BR');
      return tarefaDate === dateStr;
    });
  };

  const handleDayClick = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateStr = `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;
    navigate(`/metas-diarias?data=${dateStr}`);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const today = new Date();
  const isCurrentMonth = currentMonth.getMonth() === today.getMonth() && 
                         currentMonth.getFullYear() === today.getFullYear();

  const primeiroNome = user?.nome?.split(' ')[0] || 'usuário';
  const fraseMotivacional = `${primeiroNome}, a persistência é o caminho do êxito`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 relative overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-20"
        } p-6 md:p-8 relative z-10`}
      >
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Visão geral das suas atividades e metas
            </p>
          </div>
          <button
            onClick={toggleModoEscuro}
            className="h-10 w-10 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 flex items-center justify-center transition-colors"
            title={modoEscuro ? "Modo claro" : "Modo escuro"}
          >
            {modoEscuro ? (
              <Sun className="h-5 w-5 text-amber-500" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600" />
            )}
          </button>
        </div>

        {/* Frase Motivacional */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 dark:from-cyan-500/5 dark:via-blue-500/5 dark:to-indigo-500/5 backdrop-blur-sm border-l-4 border-l-cyan-500">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Frase do dia
              </p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white italic">
                "{fraseMotivacional}"
              </p>
            </div>
          </div>
        </Card>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Tarefas Recentes - 4 tarefas visíveis */}
          <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-cyan-600" />
              Tarefas Recentes
            </h2>
            
            {tarefasRecentes.length === 0 ? (
              <div className="text-center py-8">
                <Circle className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhuma tarefa criada ainda
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tarefasRecentes.map((tarefa) => (
                  <Card 
                    key={tarefa.id_tarefa}
                    className="p-3 bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 border-l-4 hover:shadow-md transition-shadow duration-200"
                    style={{
                      borderLeftColor: tarefa.status === "concluida"
                        ? "rgb(16, 185, 129)"
                        : tarefa.status === "andamento"
                        ? "rgb(6, 182, 212)"
                        : "rgb(251, 191, 36)",
                    }}
                  >
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                      {tarefa.titulo}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                      {tarefa.descricao}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
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
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {tarefa.data}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>

          {/* Calendário do Mês */}
          <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-600" />
              {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </h2>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const isToday = isCurrentMonth && day === today.getDate();
                const tarefasDoDia = getTarefasPorDia(day);
                const hasTarefas = tarefasDoDia.length > 0;
                const tarefasPendentes = tarefasDoDia.filter(t => t.status !== 'concluida').length;
                
                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`aspect-square flex flex-col items-center justify-center text-sm rounded-lg transition-all duration-200 hover:scale-110 relative group ${
                      isToday
                        ? "bg-gradient-to-br from-cyan-600 to-blue-600 text-white font-bold shadow-lg"
                        : hasTarefas
                        ? "bg-cyan-50 dark:bg-cyan-900/20 text-gray-900 dark:text-white font-medium hover:bg-cyan-100 dark:hover:bg-cyan-900/40"
                        : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/30"
                    }`}
                  >
                    <span>{day}</span>
                    {hasTarefas && (
                      <>
                        <div className="flex gap-0.5 mt-0.5">
                          {tarefasPendentes > 0 && (
                            <div className="h-1 w-1 rounded-full bg-amber-500" />
                          )}
                          {tarefasDoDia.some(t => t.status === 'concluida') && (
                            <div className="h-1 w-1 rounded-full bg-emerald-500" />
                          )}
                        </div>
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                          {tarefasDoDia.length} {tarefasDoDia.length === 1 ? 'tarefa' : 'tarefas'}
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Tarefas pendentes</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Tarefas concluídas</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
              Clique em um dia para ver as metas
            </p>
          </Card>
        </div>

        {/* Cards de Metas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Metas Diárias */}
          <Card 
            onClick={() => navigate('/metas-diarias')}
            className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border-t-4 border-t-cyan-500"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CalendarDays className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Metas Diárias
                </h3>
                <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">
                  Foco no dia de hoje
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Defina e acompanhe suas metas diárias. Pequenas conquistas levam a grandes resultados.
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Ver metas →</span>
              <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
            </div>
          </Card>

          {/* Metas Mensais */}
          <Card 
            onClick={() => navigate('/metas-mensais')}
            className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border-t-4 border-t-blue-500"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Metas Mensais
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  Planeje o mês inteiro
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Organize seus objetivos mensais. Consistência é a chave para o sucesso duradouro.
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Ver metas →</span>
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
          </Card>

          {/* Metas Anuais */}
          <Card 
            onClick={() => navigate('/metas-anuais')}
            className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border-t-4 border-t-indigo-500"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CalendarRange className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Metas Anuais
                </h3>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                  Visão de longo prazo
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Estabeleça suas grandes metas do ano. Sonhe grande e transforme planos em realidade.
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Ver metas →</span>
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

