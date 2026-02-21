import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TarefaViewModel } from "../viewmodel/TarefaViewModel";
import { getTopRecentItems, addRecentItem } from "@/lib/recentItems";
import type { RecentItem } from "@/lib/recentItems";
import {
  CalendarDays,
  Calendar,
  CalendarRange,
  ListTodo,
  Circle,
  Sparkles,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Target,
  CheckCircle2
} from "lucide-react";

export const PaginaInicial: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tarefas } = TarefaViewModel();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [modoEscuro, setModoEscuro] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  // Função para formatar tempo relativo
  const formatarTempoRelativo = (timestamp: number): string => {
    const agora = Date.now();
    const diff = agora - timestamp;
    const segundos = Math.floor(diff / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) return dias === 1 ? 'há 1 dia' : `há ${dias} dias`;
    if (horas > 0) return horas === 1 ? 'há 1 hora' : `há ${horas} horas`;
    if (minutos > 0) return minutos === 1 ? 'há 1 min' : `há ${minutos} min`;
    return 'agora mesmo';
  };

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

  // Itens recentes (metas e tarefas clicadas recentemente)
  const [itensRecentes, setItensRecentes] = useState<RecentItem[]>([]);

  useEffect(() => {
    // Atualiza a lista de itens recentes quando o componente monta
    const items = getTopRecentItems(6);
    setItensRecentes(items);

    // Atualiza quando há mudanças no localStorage (via evento customizado)
    const handleRecentItemsChange = () => {
      const updatedItems = getTopRecentItems(6);
      setItensRecentes(updatedItems);
    };

    // Listener para mudanças no localStorage de outros componentes
    window.addEventListener('storage', handleRecentItemsChange);
    
    // Listener customizado para mudanças na mesma aba
    window.addEventListener('recentItemsChanged', handleRecentItemsChange);

    return () => {
      window.removeEventListener('storage', handleRecentItemsChange);
      window.removeEventListener('recentItemsChanged', handleRecentItemsChange);
    };
  }, []);

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

  const mesAnterior = () => {
    const novaData = new Date(currentMonth);
    novaData.setMonth(novaData.getMonth() - 1);
    setCurrentMonth(novaData);
  };

  const mesPosterior = () => {
    const novaData = new Date(currentMonth);
    novaData.setMonth(novaData.getMonth() + 1);
    setCurrentMonth(novaData);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const today = new Date();
  const isCurrentMonth = currentMonth.getMonth() === today.getMonth() && 
                         currentMonth.getFullYear() === today.getFullYear();

  const primeiroNome = user?.nome?.split(' ')[0] || 'usuário';
  
  const frasesMotivacionais = [
    "a persistência é o caminho do êxito",
    "pequenos passos todos os dias levam a grandes conquistas",
    "o sucesso é a soma de pequenos esforços repetidos",
    "acredite no seu potencial e vá em frente",
    "cada dia é uma nova oportunidade para crescer",
    "suas metas estão mais próximas do que você imagina",
    "disciplina é a ponte entre metas e realizações",
    "você é capaz de coisas incríveis",
    "o progresso, não a perfeição, é o que importa",
    "comece onde você está, use o que você tem",
    "o único limite é aquele que você impõe a si mesmo",
    "transforme seus sonhos em planos e seus planos em ação",
    "a motivação de hoje é o sucesso de amanhã",
    "foque no progresso, não na comparação",
    "cada tarefa concluída é um passo em direção ao seu objetivo"
  ];
  
  const getDayOfYear = (date: Date) => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };
  
  const indiceFrase = getDayOfYear(today) % frasesMotivacionais.length;
  const fraseMotivacional = `${primeiroNome}, ${frasesMotivacionais[indiceFrase]}`;


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 relative overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        } p-3 sm:p-4 md:p-6 lg:p-8 relative z-10`}
      >
        {/* Botão para abrir sidebar no mobile */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mb-3 p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all inline-flex items-center gap-2"
            aria-label="Abrir menu"
          >
            <svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-sm text-gray-700 dark:text-gray-300">Menu</span>
          </button>
        )}

        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Visão geral das suas atividades e metas
            </p>
          </div>
          <button
            onClick={toggleModoEscuro}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 flex items-center justify-center transition-colors"
            title={modoEscuro ? "Modo claro" : "Modo escuro"}
          >
            {modoEscuro ? (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600" />
            )}
          </button>
        </div>

        {/* Frase Motivacional */}
        <Card className="p-4 sm:p-6 mb-6 sm:mb-8 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 dark:from-cyan-500/5 dark:via-blue-500/5 dark:to-indigo-500/5 backdrop-blur-sm border-l-4 border-l-cyan-500">
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
          <Card className="p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/70 dark:hover:border-gray-600/70 transition-all duration-200">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-cyan-600" />
              Itens Recentes
            </h2>
            
            {itensRecentes.length === 0 ? (
              <div className="text-center py-8">
                <Circle className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhum item acessado ainda
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {itensRecentes.map((item) => (
                  <Card 
                    key={`${item.tipo}-${item.id}`}
                    onClick={() => {
                      // Atualiza o item recente ao ser acessado
                      addRecentItem({
                        id: item.id,
                        tipo: item.tipo,
                        titulo: item.titulo,
                        contexto: item.contexto,
                        status: item.status,
                        importancia: item.importancia,
                        data: item.data,
                      });
                      if (item.tipo === 'meta') {
                        navigate(`/metas/${item.id}`);
                      } else {
                        navigate('/tarefas');
                      }
                    }}
                    className="p-3 bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 border-l-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                    style={{
                      borderLeftColor: item.tipo === 'meta'
                        ? "rgb(14, 165, 233)"
                        : item.status === "concluida"
                        ? "rgb(16, 185, 129)"
                        : item.status === "andamento"
                        ? "rgb(6, 182, 212)"
                        : "rgb(251, 191, 36)",
                    }}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {item.tipo === 'meta' ? (
                        <Target className="h-4 w-4 text-sky-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                          {item.titulo}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {formatarTempoRelativo(item.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between ml-6">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        item.tipo === 'meta'
                          ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                          : item.status === "concluida"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : item.status === "andamento"
                          ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}>
                        {item.tipo === 'meta' 
                          ? 'Meta' 
                          : item.status === "concluida"
                          ? "Concluída"
                          : item.status === "andamento"
                          ? "Em Andamento"
                          : "Pendente"}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>

          {/* Calendário do Mês */}
          <Card className="p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/70 dark:hover:border-gray-600/70 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-cyan-600" />
                {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={mesAnterior}
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={mesPosterior}
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
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
            className="p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 hover:border-cyan-300/70 dark:hover:border-cyan-600/70 hover:shadow-xl transition-all duration-300 cursor-pointer group border-t-4 border-t-cyan-500"
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
            className="p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/70 dark:hover:border-blue-600/70 hover:shadow-xl transition-all duration-300 cursor-pointer group border-t-4 border-t-blue-500"
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
            className="p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-300/70 dark:hover:border-indigo-600/70 hover:shadow-xl transition-all duration-300 cursor-pointer group border-t-4 border-t-indigo-500"
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

