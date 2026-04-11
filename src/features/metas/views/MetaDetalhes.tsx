import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMetaViewModel } from '../viewmodel/MetaViewModel';
import { addRecentItem } from '@/lib/recentItems';
import { getContextoConfig, sugestoesPorContexto } from '../utils/contextosHelper';
import { detectContextualInfo } from '../utils/contextualHelper';
import { getCurrentWeatherSnapshot, type WeatherSnapshot } from '@/services/weatherService';
import { StudyTimer } from '../components/StudyTimer';
import { ReadingTimer } from '../components/ReadingTimerClock';
import { TarefaMetaModel } from '../models/MetaModel';
import { useCelebrationNotifications } from '@/hooks/useTaskReminders';
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Target,
  Lightbulb,
  X,
  Cloud,
  Droplets,
  Wind,
  ShoppingCart,
  CheckSquare,
  Film,
  BookOpen,
  Star,
  ChevronDown,
  ChevronUp,
  Activity,
  Dumbbell,
  Check
} from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

type ExercicioTreino = {
  nome: string;
  series: string;
  descanso: string;
  dica?: string;
};

export const MetaDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    metas,
    metaSelecionada,
    adicionarTarefaNaMeta,
    atualizarStatusTarefa,
    excluirTarefa,
    excluirMeta,
    carregarMetaPorId,
    loading
  } = useMetaViewModel();
  
  // 🔔 Integração de Notificações - Celebrações ao concluir tarefas
  const { celebrateTaskCompletion } = useCelebrationNotifications();
  
  // Coloque todos os hooks de estado no topo, para manter ordem estável entre renders
  const [mostrarFormTarefa, setMostrarFormTarefa] = useState(false);
  const [tituloTarefa, setTituloTarefa] = useState('');
  const [descricaoTarefa, setDescricaoTarefa] = useState('');
  const [tarefaParaExcluir, setTarefaParaExcluir] = useState<number | null>(null);
  const [showExcluirMetaDialog, setShowExcluirMetaDialog] = useState(false);
  const [sugestoesAbertas, setSugestoesAbertas] = useState(true);
  const [mostrarStudyTimer, setMostrarStudyTimer] = useState(false);
  const [mostrarTimerLeitura, setMostrarTimerLeitura] = useState(false);
  const [mostrarLivros, setMostrarLivros] = useState(false);
  const [mostrarFilmes, setMostrarFilmes] = useState(false);
  const [mostrarShopping, setMostrarShopping] = useState(false);
  const [mostrarCardio, setMostrarCardio] = useState(false);
  const [mostrarWorkout, setMostrarWorkout] = useState(false);
  const [idadeCardio, setIdadeCardio] = useState<string>('');
  const [nivelCardio, setNivelCardio] = useState<string>('');
  const [tipoTreinoCardio, setTipoTreinoCardio] = useState<'curto' | 'longo'>('curto');
  const [treinoGerado, setTreinoGerado] = useState<any>(null);
  const [idadeWorkout, setIdadeWorkout] = useState<string>('');
  const [nivelWorkout, setNivelWorkout] = useState<string>('');
  const [grupoMuscular, setGrupoMuscular] = useState<string>('');
  const [tipoTreinoWorkout, setTipoTreinoWorkout] = useState<'curto' | 'longo'>('curto');
  const [treinoWorkoutGerado, setTreinoWorkoutGerado] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<WeatherSnapshot | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const meta = metaSelecionada || metas.find(m => m.id_meta === Number(id));

  useEffect(() => {
    const metaId = Number(id);
    if (!Number.isNaN(metaId)) {
      carregarMetaPorId(metaId);
    }
  }, [id]);

  // Hook deve ser chamado em toda renderização; guarda internamente quando meta existir
  useEffect(() => {
    if (!meta) return;
    addRecentItem({
      id: meta.id_meta,
      tipo: 'meta',
      titulo: meta.titulo,
      contexto: meta.contexto,
      status: meta.status,
      importancia: meta.importancia,
      data: meta.data_inicio
    });
  }, [meta?.id_meta]);

  const hasWeatherWidget = meta
    ? detectContextualInfo(meta.titulo, meta.descricao || '').some(w => w.type === 'weather')
    : false;

  useEffect(() => {
    if (!meta || !hasWeatherWidget) return;

    let mounted = true;

    const carregarClima = async () => {
      setWeatherLoading(true);
      setWeatherError(null);
      try {
        const snapshot = await getCurrentWeatherSnapshot();
        if (mounted) {
          setWeatherData(snapshot);
        }
      } catch (error: any) {
        if (!mounted) return;
        const message = error?.message || 'Não foi possível carregar o clima da sua localização.';
        setWeatherError(message);
      } finally {
        if (mounted) {
          setWeatherLoading(false);
        }
      }
    };

    carregarClima();

    return () => {
      mounted = false;
    };
  }, [meta?.id_meta, hasWeatherWidget]);

  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Card className="p-8 text-center">
          {loading ? (
            <>
              <Target className="h-16 w-16 text-blue-400 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold mb-2">Carregando meta...</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Buscando informações da meta.
              </p>
            </>
          ) : (
            <>
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Meta não encontrada</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                A meta que você está procurando não existe ou foi removida.
              </p>
              <Button onClick={() => navigate('/metas/diarias')}>
                Voltar para Metas
              </Button>
            </>
          )}
        </Card>
      </div>
    );
  }

  const contextoConfig = getContextoConfig(meta.contexto);
  const ContextIcon = contextoConfig.icon;
  const sugestoes = sugestoesPorContexto[meta.contexto];
  
  const widgetsContextuais = detectContextualInfo(meta.titulo, meta.descricao || '');
  
  // Utilitário simples para embaralhar arrays (usado para variar treinos)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = result[i];
      result[i] = result[j];
      result[j] = temp;
    }
    return result;
  };
  
  const gerarTreinoCardio = () => {
    if (!idadeCardio || !nivelCardio) {
      alert('Selecione sua idade e nível de exercício');
      return;
    }

    const cardioWidget = widgetsContextuais.find(w => w.type === 'cardio');
    if (!cardioWidget) return;

    let faixaEtaria = '18-30';
    const idade = Number.parseInt(idadeCardio);
    if (idade >= 51) {
      faixaEtaria = '51+';
    } else if (idade >= 31) {
      faixaEtaria = '31-50';
    }

    const treinoBase = cardioWidget.data.treinos[nivelCardio][faixaEtaria];

    // Gera pequenas variações para não repetir exatamente o mesmo treino
    const fases = Array.isArray(treinoBase.fases)
      ? treinoBase.fases
      : [];

    const aquecimento = fases.find((f: any) =>
      String(f.fase).toLowerCase().includes('aquec')
    );
    const resto = fases.filter((f: any) => f !== aquecimento);
    let fasesPersonalizadas = aquecimento
      ? [aquecimento, ...shuffleArray(resto)]
      : shuffleArray(fases);

    // Para treino curto, mantém aquecimento e reduz o número de fases principais
    if (tipoTreinoCardio === 'curto' && fasesPersonalizadas.length > 2) {
      const [primeira, ...restoFases] = fasesPersonalizadas;
      fasesPersonalizadas = [primeira, ...restoFases.slice(0, 1)];
    }

    const treinoPersonalizado = {
      ...treinoBase,
      duracao:
        tipoTreinoCardio === 'curto'
          ? 'Treino curto (20–30 minutos)'
          : treinoBase.duracao,
      fases: fasesPersonalizadas
    };

    setTreinoGerado(treinoPersonalizado);
  };
  
  const gerarTreinoWorkout = () => {
    if (!idadeWorkout || !nivelWorkout || !grupoMuscular) {
      alert('Selecione idade, nível e grupo muscular');
      return;
    }

    const workoutWidget = widgetsContextuais.find(w => w.type === 'workout');
    if (!workoutWidget) return;

    let faixaEtaria = '18-30';
    const idade = Number.parseInt(idadeWorkout);
    if (idade >= 51) {
      faixaEtaria = '51+';
    } else if (idade >= 31) {
      faixaEtaria = '31-50';
    }

    const treinoBase = workoutWidget.data.treinos[nivelWorkout][grupoMuscular][faixaEtaria];

    const exerciciosBase: ExercicioTreino[] = Array.isArray(treinoBase.exercicios)
      ? (treinoBase.exercicios as ExercicioTreino[])
      : [];

    const exerciciosEmbaralhados = shuffleArray<ExercicioTreino>(exerciciosBase);

    // Para treino curto, seleciona apenas os principais exercícios; para longo, mantém todos
    const exerciciosSelecionados =
      tipoTreinoWorkout === 'curto'
        ? exerciciosEmbaralhados.slice(0, Math.min(4, exerciciosEmbaralhados.length))
        : exerciciosEmbaralhados;

    // Para treinos curtos, priorizamos conjugar exercícios (supersets);
    // para treinos longos, mantemos os exercícios isolados bem separados.
    let exerciciosFinais: ExercicioTreino[] = [];

    if (tipoTreinoWorkout === 'curto') {
      const exerciciosConjugados: ExercicioTreino[] = [];

      for (let i = 0; i < exerciciosSelecionados.length; ) {
        const atual = exerciciosSelecionados[i];
        const proximo = exerciciosSelecionados[i + 1];

        if (proximo) {
          // Cria um bloco conjugado/superset com dois exercícios
          exerciciosConjugados.push({
            nome: `${atual.nome} + ${proximo.nome} (superset)`,
            series: atual.series,
            descanso: atual.descanso,
            dica:
              `Execute ${atual.nome} e logo em seguida ${proximo.nome} sem descanso entre eles. ` +
              (atual.dica || '')
          });
          i += 2;
        } else {
          // Último exercício sem par permanece sozinho
          exerciciosConjugados.push(atual);
          i += 1;
        }
      }

      exerciciosFinais = exerciciosConjugados;
    } else {
      // Treino longo: exercícios ficam isolados, como no plano base
      exerciciosFinais = exerciciosSelecionados;
    }

    const treinoPersonalizado = {
      ...treinoBase,
      duracao:
        tipoTreinoWorkout === 'curto'
          ? 'Treino curto (30–40 minutos)'
          : treinoBase.duracao,
      exercicios: exerciciosFinais
    };

    setTreinoWorkoutGerado(treinoPersonalizado);
  };
  
  const handleAdicionarTarefa = () => {
    if (!tituloTarefa.trim()) {
      alert('Digite um título para a tarefa');
      return;
    }

    adicionarTarefaNaMeta(meta.id_meta, {
      titulo: tituloTarefa.trim(),
      descricao: descricaoTarefa.trim(),
      status: 'pendente'
    });

    setTituloTarefa('');
    setDescricaoTarefa('');
    setMostrarFormTarefa(false);
  };

  const handleToggleTarefa = async (tarefa: TarefaMetaModel) => {
    const novoStatus = tarefa.status === 'concluida' ? 'pendente' : 'concluida';
    await atualizarStatusTarefa(meta.id_meta, tarefa.id_tarefa_meta, novoStatus);
    
    // 🎉 Disparar celebração ao concluir tarefa
    if (novoStatus === 'concluida') {
      await celebrateTaskCompletion(tarefa.titulo);
    }
  };

  const handleExcluirTarefa = () => {
    if (tarefaParaExcluir) {
      excluirTarefa(meta.id_meta, tarefaParaExcluir);
      setTarefaParaExcluir(null);
    }
  };

  const handleExcluirMeta = () => {
    excluirMeta(meta.id_meta);
    setShowExcluirMetaDialog(false);
    navigate('/metas/diarias');
  };

  const tarefasConcluidas = meta.tarefas.filter(t => t.status === 'concluida').length;
  const totalTarefas = meta.tarefas.length;


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <ConfirmDialog
        open={tarefaParaExcluir !== null}
        onOpenChange={() => setTarefaParaExcluir(null)}
        title="Excluir Tarefa"
        description="Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita."
        onConfirm={handleExcluirTarefa}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        variant="destructive"
      />

      <ConfirmDialog
        open={showExcluirMetaDialog}
        onOpenChange={setShowExcluirMetaDialog}
        title="Excluir Meta"
        description="Tem certeza que deseja excluir esta meta e todas as suas tarefas? Esta ação não pode ser desfeita."
        onConfirm={handleExcluirMeta}
        confirmText="Sim, excluir meta"
        cancelText="Cancelar"
        variant="destructive"
      />

      <div className="max-w-5xl mx-auto p-3 sm:p-4 md:p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <Card className={`p-6 ${contextoConfig.bgLight} ${contextoConfig.borderLight} border-2`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${contextoConfig.gradient} shadow-lg`}>
                  <ContextIcon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold ${contextoConfig.textColor} uppercase tracking-wider px-2 py-1 rounded-full ${contextoConfig.bgLight} border ${contextoConfig.borderLight}`}>
                      {contextoConfig.label}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      meta.status === 'concluida'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : meta.status === 'andamento'
                        ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {meta.status === 'concluida' ? 'Concluída' : meta.status === 'andamento' ? 'Em Andamento' : 'Pendente'}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {meta.titulo}
                  </h1>
                  {meta.descricao && (
                    <p className="text-gray-600 dark:text-gray-400">
                      {meta.descricao}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                    {meta.tipo === 'diaria' ? (
                      <span>📅 {meta.data_inicio}</span>
                    ) : (
                      <span>📅 {meta.data_inicio} - {meta.data_fim}</span>
                    )}
                    <span>•</span>
                    <span>🎯 {tarefasConcluidas}/{totalTarefas} tarefas</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExcluirMetaDialog(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progresso da Meta
                </span>
                <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  {meta.progresso}%
                </span>
              </div>
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full bg-gradient-to-r ${contextoConfig.gradient} transition-all duration-700 ease-out relative`}
                  style={{ width: `${meta.progresso}%` }}
                >
                  {meta.progresso > 0 && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {meta.contexto === 'estudos' && (
          <div className="mb-6 space-y-3">
            <Card 
              className="border border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 transition-colors cursor-pointer"
              onClick={() => setMostrarStudyTimer(!mostrarStudyTimer)}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Timer de Estudos (Pomodoro)
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {mostrarStudyTimer ? 'Fechar timer' : 'Abrir para focar nos estudos'}
                    </p>
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
                  mostrarStudyTimer ? 'rotate-180' : ''
                }`} />
              </div>
            </Card>

            {mostrarStudyTimer && (
              <div className="animate-in slide-in-from-top-2 duration-200">
                <StudyTimer />
              </div>
            )}
          </div>
        )}
        
        {widgetsContextuais.some(w => w.type === 'books') && (
          <div className="mb-6 space-y-3">
            <Card 
              className="border border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors cursor-pointer"
              onClick={() => setMostrarTimerLeitura(!mostrarTimerLeitura)}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Timer de Leitura
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {mostrarTimerLeitura ? 'Fechar' : 'Abrir timer'}
                    </p>
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
                  mostrarTimerLeitura ? 'rotate-180' : ''
                }`} />
              </div>
            </Card>
            
            {mostrarTimerLeitura && (
              <div className="animate-in slide-in-from-top-2 duration-200">
                <ReadingTimer />
              </div>
            )}
            
            <Card 
              className="border border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 transition-colors cursor-pointer"
              onClick={() => setMostrarLivros(!mostrarLivros)}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Livros Recomendados
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {mostrarLivros ? 'Fechar lista' : 'Ver recomendações'}
                    </p>
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
                  mostrarLivros ? 'rotate-180' : ''
                }`} />
              </div>
            </Card>
            
            {mostrarLivros && (
              <div className="animate-in slide-in-from-top-2 duration-200 space-y-2 bg-gray-50 dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                {widgetsContextuais.filter(w => w.type === 'books').map((widget) => 
                  widget.data.topLivros.slice(0, 3).map((livro: any, idx: number) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                      <div className="flex gap-3">
                        <img 
                          src={livro.imagem} 
                          alt={livro.titulo}
                          className="w-16 h-24 object-cover rounded shadow-sm flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">
                              {livro.titulo}
                            </h4>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold">
                                {idx + 1}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {livro.autor}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="inline-block text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                              {livro.genero}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                              <Star className="h-3 w-3 fill-current" />
                              <span className="font-medium">{livro.nota}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
        
        {widgetsContextuais.some(w => w.type === 'movies') && (
          <div className="mb-6 space-y-3">
            <Card 
              className="border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 transition-colors cursor-pointer"
              onClick={() => setMostrarFilmes(!mostrarFilmes)}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                    <Film className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Filmes em Alta
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {mostrarFilmes ? 'Fechar lista' : 'Ver recomendações'}
                    </p>
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
                  mostrarFilmes ? 'rotate-180' : ''
                }`} />
              </div>
            </Card>
            
            {mostrarFilmes && (
              <div className="animate-in slide-in-from-top-2 duration-200 space-y-2 bg-gray-50 dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                {widgetsContextuais.filter(w => w.type === 'movies').map((widget) => 
                  widget.data.topFilmes.slice(0, 3).map((filme: any, idx: number) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 transition-colors">
                      <div className="flex gap-3">
                        <img 
                          src={filme.imagem} 
                          alt={filme.titulo}
                          className="w-16 h-24 object-cover rounded shadow-sm flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">
                              {filme.titulo}
                            </h4>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold">
                                {idx + 1}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {filme.diretor}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="inline-block text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                              {filme.genero}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                              <Star className="h-3 w-3 fill-current" />
                              <span className="font-medium">{filme.nota}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
        
        {widgetsContextuais.some(w => w.type === 'shopping') && (
          <div className="mb-6 space-y-3">
            <Card 
              className="border border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors cursor-pointer"
              onClick={() => setMostrarShopping(!mostrarShopping)}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <ShoppingCart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Lista Inteligente de Compras
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {mostrarShopping ? 'Fechar sugestões' : 'Ver categorias e dicas para suas compras'}
                    </p>
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
                  mostrarShopping ? 'rotate-180' : ''
                }`} />
              </div>
            </Card>

            {mostrarShopping && (
              <div className="animate-in slide-in-from-top-2 duration-200 bg-gray-50 dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
                {widgetsContextuais.filter(w => w.type === 'shopping').map((widget, index) => (
                  <div key={`shopping-${index}`} className="space-y-4">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        Sugestão de organização das compras
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Melhor horário: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{widget.data.melhorHorario}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Array.isArray(widget.data.categorias) && widget.data.categorias.map((cat: any, idx: number) => (
                        <div key={idx} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                          <h5 className="font-semibold text-xs text-gray-900 dark:text-white mb-1">
                            {cat.nome}
                          </h5>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {Array.isArray(cat.itens) ? cat.itens.join(', ') : ''}
                          </p>
                        </div>
                      ))}
                    </div>

                    {Array.isArray(widget.data.dicas) && widget.data.dicas.length > 0 && (
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                              Dicas para suas idas ao mercado:
                            </p>
                            <ul className="text-xs text-gray-700 dark:text-gray-300 list-disc list-inside space-y-0.5">
                              {widget.data.dicas.map((dica: string, i: number) => (
                                <li key={i}>{dica}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {widgetsContextuais.some(w => w.type === 'cardio') && (
          <div className="mb-6 space-y-3">
            <Card 
              className="border border-orange-200 dark:border-orange-800 hover:border-orange-300 dark:hover:border-orange-700 transition-colors cursor-pointer"
              onClick={() => setMostrarCardio(!mostrarCardio)}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Treino de Cardio Personalizado
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {mostrarCardio ? 'Fechar gerador' : 'Gerar meu treino'}
                    </p>
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
                  mostrarCardio ? 'rotate-180' : ''
                }`} />
              </div>
            </Card>
            
            {mostrarCardio && (
              <div className="animate-in slide-in-from-top-2 duration-200 bg-gray-50 dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    Antes de iniciar este treino, procure orientação de um profissional de educação física e, se necessário, 
                  </p>avaliação médica.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="idade-cardio" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Sua Idade
                    </Label>
                    <Input
                      id="idade-cardio"
                      type="number"
                      min="18"
                      max="100"
                      placeholder="Ex: 25"
                      value={idadeCardio}
                      onChange={(e) => setIdadeCardio(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="nivel-cardio" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Nível de Exercício
                    </Label>
                    <select
                      id="nivel-cardio"
                      value={nivelCardio}
                      onChange={(e) => setNivelCardio(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Selecione...</option>
                      <option value="iniciante">Iniciante - Sedentário ou pouca atividade</option>
                      <option value="intermediario">Intermediário - Pratico 2-3x por semana</option>
                      <option value="avancado">Avançado - Pratico 4+ vezes por semana</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="tipo-cardio" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Duração do treino
                  </Label>
                  <select
                    id="tipo-cardio"
                    value={tipoTreinoCardio}
                    onChange={(e) => setTipoTreinoCardio(e.target.value as 'curto' | 'longo')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="curto">Treino curto (20–30 min)</option>
                    <option value="longo">Treino longo/completo (40–60 min)</option>
                  </select>
                </div>
                
                <Button 
                  onClick={gerarTreinoCardio}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Gerar Treino Personalizado
                </Button>
                
                {treinoGerado && (
                  <div className="mt-4 space-y-4 bg-white dark:bg-slate-800 p-4 rounded-lg border-2 border-orange-300 dark:border-orange-700">
                    <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-3">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {treinoGerado.tipo}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Duração: <span className="font-semibold text-orange-600 dark:text-orange-400">{treinoGerado.duracao}</span>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Frequência: <span className="font-semibold text-orange-600 dark:text-orange-400">{treinoGerado.frequencia}</span>
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {treinoGerado.fases.map((fase: any, idx: number) => (
                        <div key={idx} className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-bold flex-shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                                {fase.fase} - {fase.tempo}
                              </h5>
                              <p className="text-xs text-gray-700 dark:text-gray-300 mb-1">
                                {fase.intensidade}
                              </p>
                              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                                {fase.fc}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">Dica:</span> {treinoGerado.dica}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {widgetsContextuais.some(w => w.type === 'workout') && (
          <div className="mb-6 space-y-3">
            <Card 
              className="border border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 transition-colors cursor-pointer"
              onClick={() => setMostrarWorkout(!mostrarWorkout)}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Dumbbell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Treino de Musculação Personalizado
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {mostrarWorkout ? 'Fechar gerador' : 'Gerar meu treino'}
                    </p>
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
                  mostrarWorkout ? 'rotate-180' : ''
                }`} />
              </div>
            </Card>
            
            {mostrarWorkout && (
              <div className="animate-in slide-in-from-top-2 duration-200 bg-gray-50 dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-800 dark:text-amber-200">
“Este treino é uma sugestão educativa baseada em diretrizes gerais. Consulte um profissional de educação física.                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="grupo-muscular" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Grupo Muscular
                    </Label>
                    <select
                      id="grupo-muscular"
                      value={grupoMuscular}
                      onChange={(e) => setGrupoMuscular(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Selecione...</option>
                      {/* Grupos superiores / empurrão */}
                      <option value="superior">Peito</option>
                      <option value="superior">Ombros</option>
                      <option value="superior">Tríceps</option>
                      <option value="superior">Peito + Tríceps</option>
                      <option value="superior">Peito + Ombro</option>
                      <option value="superior">Peito + Tríceps + Ombro</option>
                      <option value="superior">Ombro + Trapézio</option>
                      <option value="superior">Push (Peito + Ombro + Tríceps)</option>
                      <option value="superior">Superiores (Peito + Costas + Ombros + Braços)</option>

                      {/* Grupos de costas / puxão */}
                      <option value="costas">Costas</option>
                      <option value="costas">Bíceps</option>
                      <option value="costas">Costas + Bíceps</option>
                      <option value="costas">Costas + Ombro</option>
                      <option value="costas">Pull (Costas + Bíceps + Posterior de Ombro)</option>
                      <option value="costas">Costas + Bíceps + Abdômen</option>

                      {/* Grupos inferiores */}
                      <option value="inferior">Pernas</option>
                      <option value="inferior">Glúteos</option>
                      <option value="inferior">Panturrilhas</option>
                      <option value="inferior">Pernas + Glúteos</option>
                      <option value="inferior">Pernas + Panturrilha</option>
                      <option value="inferior">Pernas completas (Quadríceps + Posterior + Glúteos + Panturrilha)</option>
                      <option value="inferior">Inferiores (Pernas + Glúteos + Panturrilha)</option>

                      {/* Combinações gerais */}
                      <option value="superior">Bíceps + Tríceps</option>
                      <option value="inferior">Full Body (ênfase em membros inferiores)</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="idade-workout" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Sua Idade
                    </Label>
                    <Input
                      id="idade-workout"
                      type="number"
                      min="18"
                      max="100"
                      placeholder="Ex: 25"
                      value={idadeWorkout}
                      onChange={(e) => setIdadeWorkout(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="nivel-workout" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Nível de Treino
                    </Label>
                    <select
                      id="nivel-workout"
                      value={nivelWorkout}
                      onChange={(e) => setNivelWorkout(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Selecione...</option>
                      <option value="iniciante">Iniciante - Até 6 meses</option>
                      <option value="intermediario">Intermediário - 6 meses a 2 anos</option>
                      <option value="avancado">Avançado - Mais de 2 anos</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="tipo-workout" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Duração do treino
                  </Label>
                  <select
                    id="tipo-workout"
                    value={tipoTreinoWorkout}
                    onChange={(e) => setTipoTreinoWorkout(e.target.value as 'curto' | 'longo')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="curto">Treino curto (30–40 min)</option>
                    <option value="longo">Treino longo/completo (60–75 min)</option>
                  </select>
                </div>
                
                <Button 
                  onClick={gerarTreinoWorkout}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Gerar Treino Personalizado
                </Button>
                
                {treinoWorkoutGerado && (
                  <div className="mt-4 space-y-4 bg-white dark:bg-slate-800 p-4 rounded-lg border-2 border-purple-300 dark:border-purple-700">
                    <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-3">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {treinoWorkoutGerado.nome}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Duração: <span className="font-semibold text-purple-600 dark:text-purple-400">{treinoWorkoutGerado.duracao}</span>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Frequência: <span className="font-semibold text-purple-600 dark:text-purple-400">{treinoWorkoutGerado.frequencia}</span>
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                        Exercícios:
                      </h5>
                      {treinoWorkoutGerado.exercicios.map((exercicio: any, idx: number) => (
                        <div key={idx} className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-bold flex-shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h6 className="font-semibold text-sm text-gray-900 dark:text-white">
                                  {exercicio.nome}
                                </h6>
                                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 whitespace-nowrap">
                                  {exercicio.series}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                                <span>Descanso: <strong>{exercicio.descanso}</strong></span>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                                💡 {exercicio.dica}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Dica */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">Dica Geral:</span> {treinoWorkoutGerado.dica}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {widgetsContextuais.length > 0 && (
          <div className="mb-6">
            {widgetsContextuais.some(w => w.type === 'weather') && sugestoes && sugestoes.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {widgetsContextuais.filter(w => w.type === 'weather').map((widget, index) => (
                  <div key={`weather-${index}`} className="bg-sky-50/80 dark:bg-sky-950/30 border-l-4 border-sky-500 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Cloud className="h-7 w-7 text-sky-600 dark:text-sky-400" />
                      <div>
                        {weatherLoading ? (
                          <span className="text-sm text-sky-700 dark:text-sky-300">Obtendo clima real da sua localização...</span>
                        ) : weatherError ? (
                          <span className="text-sm text-red-600 dark:text-red-400">{weatherError}</span>
                        ) : weatherData ? (
                          <>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-sky-900 dark:text-sky-100">
                                {weatherData.temperatura}°
                              </span>
                              <span className="text-xs font-medium text-sky-700 dark:text-sky-300">
                                {weatherData.condicao}
                              </span>
                            </div>
                            <div className="text-[11px] text-sky-700 dark:text-sky-300 mb-1">
                              {weatherData.cidade}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-sky-600 dark:text-sky-400">
                              <span className="flex items-center gap-1">
                                <Droplets className="h-3 w-3" />
                                {weatherData.umidade}%
                              </span>
                              <span className="flex items-center gap-1">
                                <Wind className="h-3 w-3" />
                                {weatherData.vento}
                              </span>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                    {weatherData?.recomendacao && !weatherLoading && !weatherError && (
                      <div className="pt-3 border-t border-sky-200 dark:border-sky-800 flex items-start gap-2">
                        <Lightbulb className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-sky-800 dark:text-sky-200">
                          {weatherData.recomendacao}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                
                {sugestoes && sugestoes.length > 0 && (
                  <Card className={`${contextoConfig.bgLight} ${contextoConfig.borderLight} border`}>
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors"
                      onClick={() => setSugestoesAbertas(!sugestoesAbertas)}
                    >
                      <div className="flex items-center gap-3">
                        <Lightbulb className={`h-5 w-5 ${contextoConfig.textColor} flex-shrink-0`} />
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Dicas para {contextoConfig.label}
                        </h4>
                      </div>
                      {sugestoesAbertas ? (
                        <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                    {sugestoesAbertas && (
                      <div className="px-4 pb-4 pt-0">
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          {sugestoes.slice(0, 3).map((sugestao, index) => (
                            <li key={index}>{sugestao}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card>
                )}
              </div>
            ) : null}
          </div>
        )}

        {sugestoes && sugestoes.length > 0 && !widgetsContextuais.some(w => w.type === 'weather') && (
          <Card className={`mb-6 ${contextoConfig.bgLight} ${contextoConfig.borderLight} border`}>
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors"
              onClick={() => setSugestoesAbertas(!sugestoesAbertas)}
            >
              <div className="flex items-center gap-3">
                <Lightbulb className={`h-5 w-5 ${contextoConfig.textColor} flex-shrink-0`} />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Dicas para {contextoConfig.label}
                </h4>
              </div>
              {sugestoesAbertas ? (
                <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              )}
            </div>
            {sugestoesAbertas && (
              <div className="px-4 pb-4 pt-0">
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {sugestoes.slice(0, 3).map((sugestao, index) => (
                    <li key={index}>{sugestao}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}

        <Card className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-5 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Checklist de Tarefas
            </h2>
            <Button
              onClick={() => setMostrarFormTarefa(!mostrarFormTarefa)}
              className={`bg-gradient-to-r ${contextoConfig.gradient} hover:opacity-90 text-white w-full sm:w-auto`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </div>

          {mostrarFormTarefa && (
            <Card className="p-4 sm:p-5 md:p-6 mb-5 sm:mb-6 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border-2 border-dashed border-gray-300 dark:border-gray-600 shadow-lg">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className={`p-2.5 rounded-lg ${contextoConfig.bgLight} ${contextoConfig.textColor}`}>
                  <CheckSquare className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Nova Tarefa</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Organize suas atividades em etapas menores
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título *
                  </label>
                  <Input
                    placeholder="Título da tarefa"
                    value={tituloTarefa}
                    onChange={(e) => setTituloTarefa(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAdicionarTarefa()}
                    className="border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descrição (opcional)
                  </label>
                  <textarea
                    placeholder="Adicione mais detalhes se necessário..."
                    value={descricaoTarefa}
                    onChange={(e) => setDescricaoTarefa(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary focus:outline-none min-h-[80px] resize-none"
                  />
                </div>
                
                <div className="flex items-center gap-2 justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={() => {
                      setMostrarFormTarefa(false);
                      setTituloTarefa('');
                      setDescricaoTarefa('');
                    }}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleAdicionarTarefa} 
                    size="sm"
                    className={`gap-2 bg-gradient-to-r ${contextoConfig.gradient} hover:opacity-90 text-white`}
                  >
                    <Check className="h-4 w-4" />
                    Adicionar Tarefa
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {meta.tarefas.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                Nenhuma tarefa adicionada ainda
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Clique em "Nova Tarefa" para começar
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...meta.tarefas].sort((a, b) => {
                if (a.status !== b.status) {
                  if (a.status === 'concluida') return 1;
                  if (b.status === 'concluida') return -1;
                }
                const ordemImportancia = { alta: 3, media: 2, baixa: 1 };
                const importanciaA = ordemImportancia[a.importancia || 'media'];
                const importanciaB = ordemImportancia[b.importancia || 'media'];
                if (importanciaA !== importanciaB) {
                  return importanciaB - importanciaA;
                }
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
              }).map((tarefa) => (
                <Card
                  key={`${tarefa.id_tarefa_meta}-${tarefa.status}`}
                  className={tarefa.status === 'concluida'
                    ? 'p-4 hover:shadow-md bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800'
                    : 'p-4 hover:shadow-md bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700'}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleTarefa(tarefa)}
                      className="mt-1 flex-shrink-0 transition-transform hover:scale-110 active:scale-95"
                    >
                      {tarefa.status === 'concluida' ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                      )}
                    </button>

                    <div className="flex-1">
                      <h4
                        className={`font-semibold text-gray-900 dark:text-white ${
                          tarefa.status === 'concluida' ? 'line-through opacity-70' : ''
                        }`}
                      >
                        {tarefa.titulo}
                      </h4>
                      {tarefa.descricao && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {tarefa.descricao}
                        </p>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTarefaParaExcluir(tarefa.id_tarefa_meta)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
