import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePastas } from '@/context/PastaContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { EditorRico } from '@/features/pastas/components/EditorRico';
import { VisualizadorResumos } from '@/features/pastas/components/VisualizadorResumos';
import { TimerHorizontal } from '@/features/metas/components/TimerHorizontal';
import { ArrowLeft, Trash2, Clock, Edit2, Check, X } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export const PastaDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    pastaSelecionada,
    selecionarPasta,
    atualizarPasta,
    excluirPasta,
    adicionarBloco,
    inserirBlocoApos,
    atualizarBloco,
    removerBloco,
    criarResumo,
    atualizarResumo,
    excluirResumo
  } = usePastas();

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [editandoTitulo, setEditandoTitulo] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [mostrarTimer, setMostrarTimer] = useState(false);
  const [showExcluirDialog, setShowExcluirDialog] = useState(false);

  useEffect(() => {
    if (id) {
      selecionarPasta(id);
    }
  }, [id, selecionarPasta]);

  useEffect(() => {
    if (pastaSelecionada) {
      setNovoTitulo(pastaSelecionada.titulo);
    }
  }, [pastaSelecionada]);

  if (!pastaSelecionada) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Pasta não encontrada</p>
      </div>
    );
  }

  const handleSalvarTitulo = () => {
    if (novoTitulo.trim() && novoTitulo !== pastaSelecionada.titulo) {
      atualizarPasta(pastaSelecionada.id, { titulo: novoTitulo.trim() });
    }
    setEditandoTitulo(false);
  };

  const handleExcluirPasta = () => {
    excluirPasta(pastaSelecionada.id);
    navigate('/pagina-inicial');
  };

  const formatarTempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0) {
      return `${horas}h ${mins}min`;
    }
    return `${mins}min`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 fixed inset-0 overflow-auto">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        } p-3 sm:p-4 md:p-6 lg:p-8`}
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
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/pagina-inicial')}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${pastaSelecionada.cor} flex items-center justify-center text-2xl shadow-lg`}>
                {pastaSelecionada.icone}
              </div>

              {/* Título ao lado do ícone */}
              {editandoTitulo ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={novoTitulo}
                    onChange={(e) => setNovoTitulo(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSalvarTitulo();
                      if (e.key === 'Escape') {
                        setNovoTitulo(pastaSelecionada.titulo);
                        setEditandoTitulo(false);
                      }
                    }}
                    className="text-2xl font-bold border-2 border-cyan-300 dark:border-cyan-700 shadow-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                    autoFocus
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleSalvarTitulo}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Check className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setNovoTitulo(pastaSelecionada.titulo);
                      setEditandoTitulo(false);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="flex items-center gap-2 group cursor-pointer" 
                  onClick={() => setEditandoTitulo(true)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditandoTitulo(true)}
                  role="button"
                  tabIndex={0}
                >
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {pastaSelecionada.titulo}
                  </h1>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {pastaSelecionada.isEstudo && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMostrarTimer(!mostrarTimer)}
                  className="gap-2 bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/40"
                >
                  <Clock className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-sm font-medium">Timer</span>
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowExcluirDialog(true)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {pastaSelecionada.isEstudo && (
            <div className="ml-16 mb-2 inline-flex items-center gap-2 px-3 py-1 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-sm">
              📚 Pasta de Estudo • {pastaSelecionada.tempoEstudo && pastaSelecionada.tempoEstudo > 0 ? formatarTempo(pastaSelecionada.tempoEstudo) : '0min'}
            </div>
          )}
        </div>

        {/* Timer Horizontal - quando ativado */}
        {mostrarTimer && pastaSelecionada.isEstudo && (
          <div className="mb-6">
            <Card className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-cyan-200 dark:border-cyan-800">
              <TimerHorizontal
                onComplete={() => {
                  const tempoAtual = pastaSelecionada.tempoEstudo || 0;
                  atualizarPasta(pastaSelecionada.id, {
                    tempoEstudo: tempoAtual + 25
                  });
                }}
                onClose={() => setMostrarTimer(false)}
              />
            </Card>
          </div>
        )}

        {/* Conteúdo Principal */}
        {pastaSelecionada.isEstudo ? (
          // Visualizador de Resumos para pastas de estudo
          <VisualizadorResumos
            resumos={pastaSelecionada.resumos || []}
            onCriarResumo={(titulo) => criarResumo(pastaSelecionada.id, titulo)}
            onAtualizarResumo={(resumoId, dados) => atualizarResumo(pastaSelecionada.id, resumoId, dados)}
            onExcluirResumo={(resumoId) => excluirResumo(pastaSelecionada.id, resumoId)}
          />
        ) : (
          // Editor Rico para pastas normais
          <Card className="p-4 sm:p-6 lg:p-8 min-h-[600px]">
            <EditorRico
              blocos={pastaSelecionada.blocos}
              onAdicionarBloco={(bloco) => adicionarBloco(pastaSelecionada.id, bloco)}
              onInserirBlocoApos={(blocoAnteriorId, bloco) => inserirBlocoApos(pastaSelecionada.id, blocoAnteriorId, bloco)}
              onAtualizarBloco={(blocoId, dados) => atualizarBloco(pastaSelecionada.id, blocoId, dados)}
              onRemoverBloco={(blocoId) => removerBloco(pastaSelecionada.id, blocoId)}
            />

            {pastaSelecionada.blocos.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg mb-2">Página em branco</p>
                <p className="text-sm">Comece adicionando um bloco de conteúdo</p>
              </div>
            )}
          </Card>
        )}

        {/* Informações da Pasta */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>
            Criada em {new Date(pastaSelecionada.criadoEm).toLocaleDateString('pt-BR')} •
            Última edição em {new Date(pastaSelecionada.atualizadoEm).toLocaleDateString('pt-BR')} às{' '}
            {new Date(pastaSelecionada.atualizadoEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Dialog de Confirmação de Exclusão */}
        <ConfirmDialog
          open={showExcluirDialog}
          onOpenChange={setShowExcluirDialog}
          onConfirm={handleExcluirPasta}
          title="Excluir Pasta"
          description={`Tem certeza que deseja excluir a pasta "${pastaSelecionada.titulo}"? Esta ação não pode ser desfeita.`}
          confirmText="Excluir"
          cancelText="Cancelar"
        />
      </main>
    </div>
  );
};
