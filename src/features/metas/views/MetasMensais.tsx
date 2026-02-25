import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { TarefaViewModel } from "@/features/tarefas/viewmodel/TarefaViewModel";
import { useMetaViewModel } from "../viewmodel/MetaViewModel";
import { ModalCriarMeta } from "../components/ModalCriarMeta";
import { addRecentItem } from "@/lib/recentItems";
import { useTaskReminders, usePeriodicDeadlineCheck } from "@/hooks/useTaskReminders";
import {
  Calendar,
  Plus,
  CheckCircle2,
  Circle,
  Target,
  TrendingUp,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Dumbbell,
  Briefcase,
  DollarSign,
  Heart,
  Smile,
  Trophy,
  Loader2
} from "lucide-react";
import Confetti from 'react-confetti';

export const MetasMensais: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mesSelecionado, setMesSelecionado] = useState(new Date());
  const [filtroAtivo, setFiltroAtivo] = useState<'todos' | 'concluida' | 'andamento' | 'pendente'>('pendente');
  const [filtroImportancia, setFiltroImportancia] = useState<'todas' | 'alta' | 'media' | 'baixa'>('todas');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [mostrarCelebracao, setMostrarCelebracao] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const { tarefas } = TarefaViewModel();
  const navigate = useNavigate();
  
  const getContextoConfig = (contexto: string) => {
    const configs: Record<string, any> = {
      estudos: { icon: BookOpen, gradient: 'from-purple-500 to-indigo-600' },
      exercicios: { icon: Dumbbell, gradient: 'from-orange-500 to-red-600' },
      trabalho: { icon: Briefcase, gradient: 'from-blue-500 to-cyan-600' },
      financas: { icon: DollarSign, gradient: 'from-green-500 to-emerald-600' },
      saude: { icon: Heart, gradient: 'from-red-500 to-pink-600' },
      lazer: { icon: Smile, gradient: 'from-pink-500 to-rose-600' },
      outros: { icon: Target, gradient: 'from-gray-500 to-slate-600' }
    };
    // Fallback simples para contextos não mapeados
    const fallback = { icon: Target, gradient: 'from-gray-500 to-slate-600' };
    return configs[contexto] || fallback;
  };
  
  const {
    modalCriarAberto,
    abrirModalCriar,
    fecharModalCriar,
    criarMeta,
    carregarMetas,
    loading,
    getMetasPorTipo,
    alternarConclusaoMeta,
    resumo
  } = useMetaViewModel();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mesAtual = mesSelecionado.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

  const mesAnterior = () => {
    const novaData = new Date(mesSelecionado);
    novaData.setMonth(novaData.getMonth() - 1);
    setMesSelecionado(novaData);
  };

  const mesPosterior = () => {
    const novaData = new Date(mesSelecionado);
    novaData.setMonth(novaData.getMonth() + 1);
    setMesSelecionado(novaData);
  };

  const mesAnoFormatado = `${(mesSelecionado.getMonth() + 1).toString().padStart(2, '0')}/${mesSelecionado.getFullYear()}`;
  
  // Carrega todas as metas do mês (sem filtros para manter contagens permanentes)
  useEffect(() => {
    carregarMetas('mensal', mesAnoFormatado, {});
  }, [mesAnoFormatado, carregarMetas]);
  
  // Todas as metas do mês (sem filtros) - para verificar celebração
  const todasMetasDoMes = getMetasPorTipo('mensal', mesAnoFormatado);

  // 🔔 Integração de Notificações - Lembretes automáticos e verificação periódica (6h)
  useTaskReminders(todasMetasDoMes, []);
  usePeriodicDeadlineCheck(todasMetasDoMes, 6);

  // Aplicar filtros client-side
  let metasDoMes = todasMetasDoMes;
  
  // Se tem pesquisa, aplica pesquisa em TODAS as metas (ignora filtro de status)
  if (termoPesquisa.trim()) {
    const termoLower = termoPesquisa.toLowerCase();
    metasDoMes = metasDoMes.filter(meta => 
      meta.titulo?.toLowerCase().includes(termoLower) ||
      meta.descricao?.toLowerCase().includes(termoLower)
    );
    // Ainda aplica filtro de importância se houver
    if (filtroImportancia !== 'todas') {
      metasDoMes = metasDoMes.filter(meta => meta.importancia === filtroImportancia);
    }
  } else {
    // Sem pesquisa: aplica filtros de status e importância normalmente
    if (filtroAtivo !== 'todos') {
      metasDoMes = metasDoMes.filter(meta => meta.status === filtroAtivo);
    }
    
    if (filtroImportancia !== 'todas') {
      metasDoMes = metasDoMes.filter(meta => meta.importancia === filtroImportancia);
    }
  }

  useEffect(() => {
    if (todasMetasDoMes.length > 0) {
      const todasConcluidas = todasMetasDoMes.every(meta => meta.status === 'concluida');
      const celebracaoKey = `celebracao_mes_${mesAnoFormatado.replace('/', '_')}`;
      const jaExibida = localStorage.getItem(celebracaoKey);
      
      if (todasConcluidas && !jaExibida) {
        setMostrarCelebracao(true);
        setTimeout(() => {
          setMostrarCelebracao(false);
          localStorage.setItem(celebracaoKey, 'true');
        }, 8000);
      } else if (!todasConcluidas) {
        localStorage.removeItem(celebracaoKey);
      }
    }
  }, [todasMetasDoMes, mesAnoFormatado]);

  const handleFecharCelebracao = () => {
    setMostrarCelebracao(false);
    const celebracaoKey = `celebracao_mes_${mesAnoFormatado.replace('/', '_')}`;
    localStorage.setItem(celebracaoKey, 'true');
  };

  const tarefasDoMes = tarefas.filter(tarefa => {
    if (!tarefa.data) return false;
    const tarefaDate = tarefa.data.includes('/') 
      ? tarefa.data 
      : new Date(tarefa.data).toLocaleDateString('pt-BR');
    const [dia, mes, ano] = tarefaDate.split('/');
    const tarefaMes = parseInt(mes);
    const tarefaAno = parseInt(ano);
    return tarefaMes === mesSelecionado.getMonth() + 1 && tarefaAno === mesSelecionado.getFullYear();
  });

  const tarefasOrdenadas = [...tarefasDoMes].sort((a, b) => {
    const prioridades = { alta: 1, media: 2, baixa: 3 };
    const prioridadeA = prioridades[a.importancia as keyof typeof prioridades] || 4;
    const prioridadeB = prioridades[b.importancia as keyof typeof prioridades] || 4;
    if (prioridadeA !== prioridadeB) return prioridadeA - prioridadeB;
    return (b.id_tarefa || 0) - (a.id_tarefa || 0);
  });

  // Tarefas ainda precisam de filtragem client-side
  let tarefasFiltradas = filtroAtivo === 'todos' 
    ? tarefasOrdenadas 
    : tarefasOrdenadas.filter(t => t.status === filtroAtivo);

  if (filtroImportancia !== 'todas') {
    tarefasFiltradas = tarefasFiltradas.filter(t => t.importancia === filtroImportancia);
  }

  if (termoPesquisa.trim()) {
    const termo = termoPesquisa.toLowerCase();
    tarefasFiltradas = tarefasFiltradas.filter(t => 
      t.titulo?.toLowerCase().includes(termo) || 
      t.descricao?.toLowerCase().includes(termo)
    );
  }

  const handleFiltroClick = (filtro: 'todos' | 'concluida' | 'andamento' | 'pendente') => {
    setFiltroAtivo(filtro);
  };

  // Metas já vêm filtradas do backend
  const itensCompletos = [
    ...metasDoMes.map(meta => ({ ...meta, tipo: 'meta' as const })),
    ...tarefasFiltradas.map(tarefa => ({ ...tarefa, tipo: 'tarefa' as const }))
  ];

  const itensFiltrados = itensCompletos;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 relative overflow-hidden">
      {mostrarCelebracao && (
        <>
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="p-8 max-w-lg mx-4 text-center bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950 dark:to-cyan-950 border-4 border-emerald-400 dark:border-emerald-600 animate-bounce-in">
              <div className="inline-block p-4 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 mb-4">
                <Trophy className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Todas as Metas Concluídas!
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                Parabéns! Você completou todas as {metasDoMes.length} {metasDoMes.length === 1 ? 'meta' : 'metas'} do mês.
              </p>
              <Button
                onClick={handleFecharCelebracao}
                className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:opacity-90 text-white px-6 py-3"
              >
                Continuar
              </Button>
            </Card>
          </div>
        </>
      )}
      
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
          <Calendar className="h-32 w-32" strokeWidth={1} />
        </div>
        <div 
          className="absolute text-blue-300/30 dark:text-blue-600/20"
          style={{
            right: `${mousePos.x * 0.01}px`,
            top: `${mousePos.y * 0.03}px`,
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

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Metas Mensais
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 capitalize">
                {mesAtual}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={mesAnterior}
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={mesPosterior}
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button onClick={abrirModalCriar} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 h-10 sm:h-11 px-4 sm:px-6 w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden xs:inline">Nova Meta</span>
            <span className="xs:hidden">Nova</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Card 
            onClick={() => handleFiltroClick('concluida')}
            className={`p-3 sm:p-4 md:p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-emerald-500 hover:shadow-lg transition-all duration-300 cursor-pointer ${
              filtroAtivo === 'concluida' ? 'ring-2 ring-emerald-500 shadow-lg scale-105' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Concluídas
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {resumo.concluidas + tarefasDoMes.filter(t => t.status === 'concluida').length}
                </p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </Card>

          <Card 
            onClick={() => handleFiltroClick('andamento')}
            className={`p-3 sm:p-4 md:p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-cyan-500 hover:shadow-lg transition-all duration-300 cursor-pointer ${
              filtroAtivo === 'andamento' ? 'ring-2 ring-cyan-500 shadow-lg scale-105' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Em Andamento
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {resumo.em_andamento + tarefasDoMes.filter(t => t.status === 'andamento').length}
                </p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
          </Card>

          <Card 
            onClick={() => handleFiltroClick('pendente')}
            className={`p-3 sm:p-4 md:p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-amber-500 hover:shadow-lg transition-all duration-300 cursor-pointer ${
              filtroAtivo === 'pendente' ? 'ring-2 ring-amber-500 shadow-lg scale-105' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Pendentes
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {resumo.pendentes + tarefasDoMes.filter(t => t.status === 'pendente').length}
                </p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <Circle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-6">
          <div className="flex-[1.5]">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">Pesquisar:</p>
            <Input 
              type="text"
              placeholder="Buscar por título, descrição..."
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">Filtrar por importância:</p>
            <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setFiltroImportancia('alta')}
              className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                filtroImportancia === 'alta'
                  ? 'bg-rose-100 text-rose-700 border-2 border-rose-500 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-500'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-rose-300 hover:bg-rose-50 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700 dark:hover:border-rose-700'
              }`}
            >
              <span className="hidden sm:inline">🔴 Alta</span>
              <span className="sm:hidden">🔴</span>
            </button>
            <button
              onClick={() => setFiltroImportancia('media')}
              className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                filtroImportancia === 'media'
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-500 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-500'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700 dark:hover:border-blue-700'
              }`}
            >
              <span className="hidden sm:inline">🔵 Média</span>
              <span className="sm:hidden">🔵</span>
            </button>
            <button
              onClick={() => setFiltroImportancia('baixa')}
              className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                filtroImportancia === 'baixa'
                  ? 'bg-gray-100 text-gray-700 border-2 border-gray-500 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-500'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700 dark:hover:border-gray-600'
              }`}
            >
              <span className="hidden sm:inline">⚪ Baixa</span>
              <span className="sm:hidden">⚪</span>
            </button>
            </div>
          </div>
        </div>
        <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 backdrop-blur-sm border-l-4 border-l-blue-500">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Crie uma meta, clique nela e defina pequenas tarefas para cumpri-la!</strong> 🎯 Metas organizam seu mês em objetivos maiores.
              </p>
            </div>
          </div>
        </Card>

        {/* Loading State com Skeleton */}
        {loading && metasDoMes.length === 0 ? (
          <div>
            <div className="flex items-center justify-center gap-3 mb-6 py-4">
              <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Carregando metas...</p>
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-5 bg-white/60 dark:bg-slate-900/60 animate-pulse">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-14 w-14 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : itensFiltrados.length === 0 ? (
          <Card className="p-12 text-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center">
              <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Nenhuma meta ou tarefa para este mês
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Comece definindo suas metas para este mês
              </p>
            </div>
          </Card>
        ) : (
          <div className="relative">
            {/* Overlay de loading quando há items na lista */}
            {loading && metasDoMes.length > 0 && (
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Processando...</p>
                </div>
              </div>
            )}
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                {filtroAtivo === 'todos' ? 'Metas e Tarefas' :
                 filtroAtivo === 'concluida' ? 'Concluídas' :
                 filtroAtivo === 'andamento' ? 'Em Andamento' :
                 'Pendentes'}
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {itensFiltrados.filter(i => i.tipo === 'meta').length} {itensFiltrados.filter(i => i.tipo === 'meta').length === 1 ? 'meta' : 'metas'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {itensFiltrados.filter(item => item.tipo === 'meta').map((item) => {
                const meta = item;
                const contextoConfig = getContextoConfig(meta.contexto);
                const ContextIcon = contextoConfig.icon;
                const tarefasConcluidas = meta.tarefas.filter((t: any) => t.status === 'concluida').length;
                const totalTarefas = meta.tarefas.length;
                
                return (
                  <Card
                    key={`meta-${meta.id_meta}-${meta.status}`}
                    onClick={() => {
                      addRecentItem({
                        id: meta.id_meta,
                        tipo: 'meta',
                        titulo: meta.titulo,
                        contexto: meta.contexto,
                        status: meta.status,
                      });
                      navigate(`/metas/${meta.id_meta}`);
                    }}
                    className={`group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden ${
                      meta.status === 'concluida' ? 'opacity-60' : ''
                    }`}
                    style={{ 
                      background: meta.status === 'concluida' 
                        ? 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
                        : `linear-gradient(135deg, ${contextoConfig.bgLight} 0%, white 100%)`,
                    }}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl shadow-sm ${
                            meta.status === 'concluida' ? 'bg-gray-200 dark:bg-gray-700' : contextoConfig.bgIcon
                          }`}>
                            <ContextIcon className={`h-5 w-5 ${
                              meta.status === 'concluida' ? 'text-gray-500 dark:text-gray-400' : contextoConfig.iconColor
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-base font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 ${
                              meta.status === 'concluida' ? 'line-through opacity-60' : ''
                            }`}>
                              {meta.titulo}
                            </h3>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            alternarConclusaoMeta(meta.id_meta);
                          }}
                          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          {meta.status === 'concluida' ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : meta.status === 'andamento' ? (
                            <Clock className="h-5 w-5 text-sky-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-slate-400" />
                          )}
                        </button>
                      </div>

                      {meta.descricao && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {meta.descricao}
                        </p>
                      )}

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Progresso
                          </span>
                          <span className={`text-xs font-semibold ${
                            meta.status === 'concluida' ? 'text-gray-500' : contextoConfig.textColor
                          }`}>
                            {meta.progresso}%
                          </span>
                        </div>
                        <div className="h-2.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              meta.status === 'concluida' ? 'bg-gray-400' : `bg-gradient-to-r ${contextoConfig.gradient}`
                            }`}
                            style={{ width: `${meta.progresso}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2.5 py-1 rounded-lg font-medium shadow-sm ${
                            meta.status === "concluida"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : meta.status === "andamento"
                              ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          }`}>
                            {meta.status === "concluida" ? "✓ Concluída" : meta.status === "andamento" ? "→ Andamento" : "○ Pendente"}
                          </span>
                          {meta.importancia === "alta" && (
                            <span className="text-xs px-2.5 py-1 rounded-lg font-medium shadow-sm bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                              🔴 Alta
                            </span>
                          )}
                          {meta.importancia === "media" && (
                            <span className="text-xs px-2.5 py-1 rounded-lg font-medium shadow-sm bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                              🔵 Média
                            </span>
                          )}
                          {meta.importancia === "baixa" && (
                            <span className="text-xs px-2.5 py-1 rounded-lg font-medium shadow-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                              ⚪ Baixa
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Target className="h-3.5 w-3.5" />
                            {totalTarefas}
                          </span>
                          {totalTarefas > 0 && (
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                              {tarefasConcluidas}/{totalTarefas}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
            
            {itensFiltrados.filter(item => item.tipo === 'tarefa').length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  Tarefas Individuais
                </h3>
                {itensFiltrados.filter(item => item.tipo === 'tarefa').map((item) => {
                const tarefa = item;
                return (
                  <div
                    key={`tarefa-${tarefa.id_tarefa}`}
                    className="p-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      {tarefa.status === 'concluida' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                      ) : tarefa.status === 'andamento' ? (
                        <Clock className="h-4 w-4 text-cyan-600 dark:text-cyan-400 mt-0.5" />
                      ) : (
                        <Circle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                      )}

                      <div className="flex-1">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                          {tarefa.titulo}
                        </h3>

                        {tarefa.descricao && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {tarefa.descricao}
                          </p>
                        )}

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded font-medium ${
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
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            )}
          </>
          </div>
        )}
      </main>

      <ModalCriarMeta
        open={modalCriarAberto}
        onClose={fecharModalCriar}
        onConfirm={async (dados) => {
          await criarMeta(dados);
          // Recarrega lista para garantir sincronização
          await carregarMetas('mensal', mesAnoFormatado, {});
        }}
        tipo="mensal"
        dataInicial={mesAnoFormatado}
      />
    </div>
  );
};

