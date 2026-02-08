import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TarefaViewModel } from "@/features/tarefas/viewmodel/TarefaViewModel";
import { PesquisaTarefa } from "@/features/tarefas/components/PesquisaTarefa";
import { useMetaViewModel } from "../viewmodel/MetaViewModel";
import { ModalCriarMeta } from "../components/ModalCriarMeta";
import { ModalVisualizarMeta } from "../components/ModalVisualizarMeta";
import { addRecentItem } from "@/lib/recentItems";
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  Circle,
  Target,
  TrendingUp,
  Clock,
  Sparkles,
  BookOpen,
  Dumbbell,
  Briefcase,
  DollarSign,
  Heart,
  Smile,
  MoreHorizontal,
  Trophy
} from "lucide-react";
import Confetti from 'react-confetti';

export const MetasDiarias: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [filtroAtivo, setFiltroAtivo] = useState<'todos' | 'concluida' | 'andamento' | 'pendente'>('todos');
  const [filtroImportancia, setFiltroImportancia] = useState<'todas' | 'alta' | 'media' | 'baixa'>('todas');
  const [mostrarCelebracao, setMostrarCelebracao] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const location = useLocation();
  const navigate = useNavigate();
  const { tarefas } = TarefaViewModel();
  
  const getContextoConfig = (contexto: string) => {
    const configs: Record<string, any> = {
      estudos: { icon: BookOpen, gradient: 'from-purple-500 to-indigo-600', iconColor: 'text-purple-600', bgIcon: 'bg-purple-100 dark:bg-purple-900/30' },
      exercicios: { icon: Dumbbell, gradient: 'from-orange-500 to-red-600', iconColor: 'text-orange-600', bgIcon: 'bg-orange-100 dark:bg-orange-900/30' },
      trabalho: { icon: Briefcase, gradient: 'from-blue-500 to-cyan-600', iconColor: 'text-blue-600', bgIcon: 'bg-blue-100 dark:bg-blue-900/30' },
      financas: { icon: DollarSign, gradient: 'from-green-500 to-emerald-600', iconColor: 'text-emerald-600', bgIcon: 'bg-emerald-100 dark:bg-emerald-900/30' },
      saude: { icon: Heart, gradient: 'from-red-500 to-pink-600', iconColor: 'text-red-600', bgIcon: 'bg-red-100 dark:bg-red-900/30' },
      lazer: { icon: Smile, gradient: 'from-pink-500 to-rose-600', iconColor: 'text-pink-600', bgIcon: 'bg-pink-100 dark:bg-pink-900/30' },
      outros: { icon: MoreHorizontal, gradient: 'from-gray-500 to-slate-600', iconColor: 'text-gray-600', bgIcon: 'bg-gray-100 dark:bg-gray-900/30' }
    };
    return configs[contexto] || configs.outros;
  };
  
  const {
    modalCriarAberto,
    abrirModalCriar,
    fecharModalCriar,
    criarMeta,
    getMetasPorTipo,
    alternarConclusaoMeta
  } = useMetaViewModel();

  const searchParams = new URLSearchParams(location.search);
  const dataUrl = searchParams.get('data');
  
  const getDataSelecionada = () => {
    if (dataUrl) {
      const [dia, mes, ano] = dataUrl.split('/');
      return new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
    }
    return new Date();
  };

  const dataSelecionada = getDataSelecionada();
  
  const hoje = new Date();
  const isHoje = dataSelecionada.toLocaleDateString('pt-BR') === hoje.toLocaleDateString('pt-BR');
  
  const tituloData = isHoje 
    ? "Hoje" 
    : dataSelecionada.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

  const infoData = dataSelecionada.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const tarefasDoDia = tarefas.filter(tarefa => {
    if (!tarefa.data) return false;
    const tarefaDate = tarefa.data.includes('/') 
      ? tarefa.data 
      : new Date(tarefa.data).toLocaleDateString('pt-BR');
    const dataFormatada = dataSelecionada.toLocaleDateString('pt-BR');
    return tarefaDate === dataFormatada;
  });

  const tarefasOrdenadas = [...tarefasDoDia].sort((a, b) => {
    const prioridades = { alta: 1, media: 2, baixa: 3 };
    const prioridadeA = prioridades[a.importancia as keyof typeof prioridades] || 4;
    const prioridadeB = prioridades[b.importancia as keyof typeof prioridades] || 4;
    
    if (prioridadeA !== prioridadeB) {
      return prioridadeA - prioridadeB;
    }
    
    return (b.id_tarefa || 0) - (a.id_tarefa || 0);
  });

  const tarefasFiltradas = filtroAtivo === 'todos' 
    ? tarefasOrdenadas 
    : tarefasOrdenadas.filter(t => t.status === filtroAtivo);

  const handleFiltroClick = (filtro: 'todos' | 'concluida' | 'andamento' | 'pendente') => {
    setFiltroAtivo(filtro);
  };

  const dataFormatada = dataSelecionada.toLocaleDateString('pt-BR');
  const metasDoDia = getMetasPorTipo('diaria', dataFormatada);

  const itensCompletos = [
    ...metasDoDia.map(meta => ({ ...meta, tipo: 'meta' as const })),
    ...tarefasOrdenadas.map(tarefa => ({ ...tarefa, tipo: 'tarefa' as const }))
  ];

  let itensFiltrados = filtroAtivo === 'todos'
    ? itensCompletos
    : itensCompletos.filter(item => item.status === filtroAtivo);

  if (filtroImportancia !== 'todas') {
    itensFiltrados = itensFiltrados.filter(item => {
      if (item.tipo === 'tarefa') {
        return item.importancia === filtroImportancia;
      }
      return true;
    });
  }

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

  useEffect(() => {
    if (metasDoDia.length > 0) {
      const todasConcluidas = metasDoDia.every(meta => meta.status === 'concluida');
      const celebracaoKey = `celebracao_dia_${dataFormatada}`;
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
  }, [metasDoDia, dataFormatada]);

  const handleFecharCelebracao = () => {
    setMostrarCelebracao(false);
    const celebracaoKey = `celebracao_dia_${dataFormatada}`;
    localStorage.setItem(celebracaoKey, 'true');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 relative overflow-hidden">
      {/* Celebração */}
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
                Parabéns! Você completou todas as {metasDoDia.length} {metasDoDia.length === 1 ? 'meta' : 'metas'} do dia.
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {isHoje ? "Tarefas de Hoje" : `Metas Diárias do dia ${tituloData}`}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {infoData}
            </p>
          </div>
          <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 h-11 px-6" onClick={abrirModalCriar}>
            <Plus className="mr-2 h-5 w-5" />
            Nova Meta
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card 
            onClick={() => handleFiltroClick('concluida')}
            className={`p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-emerald-500 hover:shadow-lg transition-all duration-300 cursor-pointer ${
              filtroAtivo === 'concluida' ? 'ring-2 ring-emerald-500 shadow-lg scale-105' : ''
            }`}
          >
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

          <Card 
            onClick={() => handleFiltroClick('andamento')}
            className={`p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-cyan-500 hover:shadow-lg transition-all duration-300 cursor-pointer ${
              filtroAtivo === 'andamento' ? 'ring-2 ring-cyan-500 shadow-lg scale-105' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Em Andamento
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {tarefasDoDia.filter(t => t.status === 'andamento').length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
          </Card>

          <Card 
            onClick={() => handleFiltroClick('pendente')}
            className={`p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-amber-500 hover:shadow-lg transition-all duration-300 cursor-pointer ${
              filtroAtivo === 'pendente' ? 'ring-2 ring-amber-500 shadow-lg scale-105' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Pendentes
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {tarefasDoDia.filter(t => t.status === 'pendente').length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Circle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="flex-[1.5]">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Pesquisar:</p>
            <PesquisaTarefa />
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Filtrar por importância:</p>
            <div className="flex gap-2">
              <button
                onClick={() => setFiltroImportancia('alta')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filtroImportancia === 'alta'
                    ? 'bg-rose-100 text-rose-700 border-2 border-rose-500 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-500'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-rose-300 hover:bg-rose-50 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700 dark:hover:border-rose-700'
                }`}
              >
                🔴 Alta
              </button>
              <button
                onClick={() => setFiltroImportancia('media')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filtroImportancia === 'media'
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-500 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-500'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700 dark:hover:border-blue-700'
                }`}
              >
                🔵 Média
              </button>
              <button
                onClick={() => setFiltroImportancia('baixa')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filtroImportancia === 'baixa'
                    ? 'bg-gray-100 text-gray-700 border-2 border-gray-500 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-500'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700 dark:hover:border-gray-600'
                }`}
              >
                ⚪ Baixa
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
                <strong>Crie uma meta, clique nela e defina pequenas tarefas para cumpri-la!</strong> 🎯 Metas organizam seu dia em objetivos maiores.
              </p>
            </div>
          </div>
        </Card>

   
        {itensFiltrados.length === 0 ? (
          <Card className="p-12 text-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center">
              <CalendarDays className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Nenhuma meta ou tarefa para este dia
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Clique em "Nova Meta" para começar
              </p>
            </div>
          </Card>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                {filtroAtivo === 'todos' ? 'Todas as Metas' :
                 filtroAtivo === 'concluida' ? 'Metas Concluídas' :
                 filtroAtivo === 'andamento' ? 'Metas em Andamento' :
                 'Metas Pendentes'}
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {itensFiltrados.filter(i => i.tipo === 'meta').length} {itensFiltrados.filter(i => i.tipo === 'meta').length === 1 ? 'meta' : 'metas'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {itensFiltrados.filter(item => item.tipo === 'meta').map((item) => {
                const meta = item;
                const contextoConfig = getContextoConfig(meta.contexto || 'outros');
                const ContextIcon = contextoConfig.icon;
                const tarefasConcluidas = meta.tarefas.filter((t: any) => t.status === 'concluida').length;
                const totalTarefas = meta.tarefas.length;
                
                return (
                  <Card
                    key={`meta-${meta.id_meta}-${meta.status}`}
                    onClick={() => {
                      // Adiciona aos itens recentes
                      addRecentItem({
                        id: meta.id_meta,
                        tipo: 'meta',
                        titulo: meta.titulo,
                        contexto: meta.contexto,
                        status: meta.status,
                        importancia: meta.importancia
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
          </div>
        )}
      </main>

      {/* Modais */}
      <ModalCriarMeta
        open={modalCriarAberto}
        onClose={fecharModalCriar}
        onConfirm={criarMeta}
        tipo="diaria"
        dataInicial={dataFormatada}
      />
    </div>
  );
};