import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MetaModel, TarefaMetaModel } from "../models/MetaModel";
import {
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Target,
  Trash2,
  X,
  BookOpen,
  Dumbbell,
  Briefcase,
  DollarSign,
  Heart,
  Smile,
  Lightbulb
} from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { StudyTimer } from "./StudyTimer";

interface ModalVisualizarMetaProps {
  open: boolean;
  onClose: () => void;
  meta: MetaModel | null;
  onAdicionarTarefa: (idMeta: number, tarefa: Partial<TarefaMetaModel>) => void;
  onAtualizarStatus: (idMeta: number, idTarefa: number, status: 'pendente' | 'andamento' | 'concluida') => void;
  onExcluirTarefa: (idMeta: number, idTarefa: number) => void;
  onExcluirMeta: (idMeta: number) => void;
  onConcluirMeta: (idMeta: number) => void;
}

export function ModalVisualizarMeta({
  open,
  onClose,
  meta,
  onAdicionarTarefa,
  onAtualizarStatus,
  onExcluirTarefa,
  onExcluirMeta,
  onConcluirMeta
}: ModalVisualizarMetaProps) {
  const [mostrarFormTarefa, setMostrarFormTarefa] = useState(false);
  const [tituloTarefa, setTituloTarefa] = useState("");
  const [descricaoTarefa, setDescricaoTarefa] = useState("");
  const [showExcluirMetaDialog, setShowExcluirMetaDialog] = useState(false);
  const [tarefaParaExcluir, setTarefaParaExcluir] = useState<number | null>(null);

  if (!meta) return null;

  const contextosConfig = {
    estudos: { 
      icon: BookOpen, 
      label: 'Estudos', 
      color: 'purple',
      gradient: 'from-purple-500 to-indigo-600',
      bgLight: 'bg-purple-50 dark:bg-purple-950/20',
      borderLight: 'border-purple-200 dark:border-purple-800',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    exercicios: { 
      icon: Dumbbell, 
      label: 'Exercícios', 
      color: 'orange',
      gradient: 'from-orange-500 to-red-600',
      bgLight: 'bg-orange-50 dark:bg-orange-950/20',
      borderLight: 'border-orange-200 dark:border-orange-800',
      textColor: 'text-orange-600 dark:text-orange-400'
    },
    trabalho: { 
      icon: Briefcase, 
      label: 'Trabalho', 
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-600',
      bgLight: 'bg-blue-50 dark:bg-blue-950/20',
      borderLight: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    financas: { 
      icon: DollarSign, 
      label: 'Finanças', 
      color: 'green',
      gradient: 'from-green-500 to-emerald-600',
      bgLight: 'bg-green-50 dark:bg-green-950/20',
      borderLight: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-600 dark:text-green-400'
    },
    saude: { 
      icon: Heart, 
      label: 'Saúde', 
      color: 'red',
      gradient: 'from-red-500 to-pink-600',
      bgLight: 'bg-red-50 dark:bg-red-950/20',
      borderLight: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-600 dark:text-red-400'
    },
    lazer: { 
      icon: Smile, 
      label: 'Lazer', 
      color: 'pink',
      gradient: 'from-pink-500 to-rose-600',
      bgLight: 'bg-pink-50 dark:bg-pink-950/20',
      borderLight: 'border-pink-200 dark:border-pink-800',
      textColor: 'text-pink-600 dark:text-pink-400'
    }
  };

  // Fallback simples para contextos não mapeados
  const fallbackConfig = {
    icon: Target,
    label: 'Meta',
    color: 'gray',
    gradient: 'from-gray-500 to-slate-600',
    bgLight: 'bg-gray-50 dark:bg-gray-950/20',
    borderLight: 'border-gray-200 dark:border-gray-800',
    textColor: 'text-gray-600 dark:text-gray-400'
  };

  const contextoAtual = contextosConfig[meta.contexto as keyof typeof contextosConfig] || fallbackConfig;
  const ContextIcon = contextoAtual.icon;

  const studySuggestions = [
    '📚 Revise conceitos anteriores antes de avançar',
    '✍️ Faça anotações à mão para melhor retenção',
    '🎯 Ensine o conteúdo para alguém (técnica Feynman)',
    '🔄 Use repetição espaçada para memorização',
    '🧠 Alterne entre diferentes tipos de conteúdo',
    '☕ Faça pausas regulares (técnica Pomodoro)'
  ];

  const handleAdicionarTarefa = () => {
    if (!tituloTarefa.trim()) {
      alert("Digite um título para a tarefa");
      return;
    }

    onAdicionarTarefa(meta.id_meta, {
      titulo: tituloTarefa.trim(),
      descricao: descricaoTarefa.trim(),
      status: 'pendente'
    });

    // Limpar formulário
    setTituloTarefa("");
    setDescricaoTarefa("");
    setMostrarFormTarefa(false);
  };

  const handleToggleStatus = (tarefa: TarefaMetaModel) => {
    let novoStatus: 'pendente' | 'andamento' | 'concluida';
    
    if (tarefa.status === 'pendente') {
      novoStatus = 'andamento';
    } else if (tarefa.status === 'andamento') {
      novoStatus = 'concluida';
    } else {
      novoStatus = 'pendente';
    }

    onAtualizarStatus(meta.id_meta, tarefa.id_tarefa_meta, novoStatus);
  };

  const confirmarExcluirTarefa = (idTarefa: number) => {
    setTarefaParaExcluir(idTarefa);
  };

  const handleExcluirTarefa = () => {
    if (tarefaParaExcluir) {
      onExcluirTarefa(meta.id_meta, tarefaParaExcluir);
      setTarefaParaExcluir(null);
    }
  };

  const handleExcluirMeta = () => {
    onExcluirMeta(meta.id_meta);
    setShowExcluirMetaDialog(false);
  };

  const tarefasConcluidas = meta.tarefas.filter(t => t.status === 'concluida').length;
  const tarefasAndamento = meta.tarefas.filter(t => t.status === 'andamento').length;
  const tarefasPendentes = meta.tarefas.filter(t => t.status === 'pendente').length;

  return (
    <>
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

      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl mx-3 sm:mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${contextoAtual.bgLight} ${contextoAtual.borderLight} border-2`}>
                    <ContextIcon className={`h-5 w-5 ${contextoAtual.textColor}`} />
                  </div>
                  <div>
                    <span className={`text-xs font-medium ${contextoAtual.textColor} uppercase tracking-wide`}>
                      {contextoAtual.label}
                    </span>
                    <DialogTitle className="text-2xl font-bold">
                      {meta.titulo}
                    </DialogTitle>
                  </div>
                </div>
                {meta.descricao && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-14">
                    {meta.descricao}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {meta.status !== 'concluida' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onConcluirMeta(meta.id_meta)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/30"
                    title="Marcar meta como concluída (todas as tarefas serão marcadas como concluídas)"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExcluirMetaDialog(true)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Timer de Estudos - apenas para contexto de estudos */}
          {meta.contexto === 'estudos' && (
            <div className="mb-6">
              <StudyTimer />
            </div>
          )}

          {/* Sugestões por Contexto */}
          {meta.contexto === 'estudos' && (
            <Card className={`p-4 mb-4 ${contextoAtual.bgLight} ${contextoAtual.borderLight} border`}>
              <div className="flex items-start gap-3">
                <Lightbulb className={`h-5 w-5 ${contextoAtual.textColor} flex-shrink-0 mt-0.5`} />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Dicas de Estudo
                  </h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {studySuggestions.slice(0, 3).map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {/* Informações da Meta */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Card className="p-3 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Período</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {meta.data_inicio} - {meta.data_fim}
                  </p>
                </div>
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </Card>

            <Card className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Progresso</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {meta.progresso}% concluído
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    {meta.progresso}%
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Barra de Progresso */}
          <div className="mb-6">
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${contextoAtual.gradient} transition-all duration-500`}
                style={{ width: `${meta.progresso}%` }}
              />
            </div>
          </div>

          {/* Resumo das Tarefas */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Card className="p-3 border-l-4 border-l-amber-500">
              <div className="flex items-center gap-2">
                <Circle className="h-4 w-4 text-amber-600" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Pendentes</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{tarefasPendentes}</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 border-l-4 border-l-cyan-500">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyan-600" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Em Andamento</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{tarefasAndamento}</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 border-l-4 border-l-emerald-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Concluídas</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{tarefasConcluidas}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Header Tarefas */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tarefas da Meta ({meta.tarefas.length})
            </h3>
            <Button
              onClick={() => setMostrarFormTarefa(!mostrarFormTarefa)}
              size="sm"
              className={`bg-gradient-to-r ${contextoAtual.gradient} hover:opacity-90 text-white`}
            >
              <Plus className="h-4 w-4 mr-1" />
              Nova Tarefa
            </Button>
          </div>

          {/* Formulário de Nova Tarefa */}
          {mostrarFormTarefa && (
            <Card className={`p-4 mb-4 ${contextoAtual.bgLight} ${contextoAtual.borderLight} border`}>
              <div className="flex flex-col gap-3">
                <Input
                  placeholder="Título da tarefa"
                  value={tituloTarefa}
                  onChange={(e) => setTituloTarefa(e.target.value)}
                />
                <textarea
                  placeholder="Descrição (opcional)"
                  value={descricaoTarefa}
                  onChange={(e) => setDescricaoTarefa(e.target.value)}
                  className="border p-2 rounded-lg focus:ring-2 focus:ring-primary/40 focus:outline-none min-h-[60px] resize-none"
                />
                <div className="flex items-center gap-2 justify-end">
                  <Button onClick={handleAdicionarTarefa} size="sm">
                    Adicionar
                  </Button>
                  <Button
                    onClick={() => {
                      setMostrarFormTarefa(false);
                      setTituloTarefa("");
                      setDescricaoTarefa("");
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Lista de Tarefas */}
          {meta.tarefas.length === 0 ? (
            <Card className="p-8 text-center bg-gray-50 dark:bg-gray-900/30">
              <Target className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                Nenhuma tarefa adicionada ainda
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Clique em "Nova Tarefa" para começar
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {meta.tarefas.map((tarefa) => (
                <Card
                  key={tarefa.id_tarefa_meta}
                  className={`p-4 hover:shadow-md transition-all duration-200 border-l-4 ${
                    tarefa.status === 'concluida'
                      ? 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/10'
                      : tarefa.status === 'andamento'
                      ? 'border-l-cyan-500'
                      : 'border-l-amber-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleStatus(tarefa)}
                      className="mt-1 flex-shrink-0 transition-transform hover:scale-110"
                    >
                      {tarefa.status === 'concluida' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      ) : tarefa.status === 'andamento' ? (
                        <Clock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      )}
                    </button>

                    <div className="flex-1">
                      <h4 className={`font-semibold text-gray-900 dark:text-white ${
                        tarefa.status === 'concluida' ? 'line-through opacity-70' : ''
                      }`}>
                        {tarefa.titulo}
                      </h4>
                      {tarefa.descricao && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {tarefa.descricao}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          tarefa.status === 'concluida'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : tarefa.status === 'andamento'
                            ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {tarefa.status === 'concluida' ? '✓ Concluída' :
                           tarefa.status === 'andamento' ? '⟳ Em Andamento' : '○ Pendente'}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => confirmarExcluirTarefa(tarefa.id_tarefa_meta)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button onClick={onClose} variant="outline">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
