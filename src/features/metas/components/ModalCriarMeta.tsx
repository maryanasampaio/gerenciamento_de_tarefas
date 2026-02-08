import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MetaModel, ContextoMeta } from "../models/MetaModel";
import {
  BookOpen,
  Dumbbell,
  Briefcase,
  DollarSign,
  Heart,
  Smile,
  MoreHorizontal
} from "lucide-react";

interface ModalCriarMetaProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (dados: Partial<MetaModel>) => void;
  tipo: 'diaria' | 'mensal' | 'anual';
  dataInicial?: string;
}

export function ModalCriarMeta({
  open,
  onClose,
  onConfirm,
  tipo,
  dataInicial
}: ModalCriarMetaProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [contexto, setContexto] = useState<ContextoMeta>('outros');
  const [importancia, setImportancia] = useState<'baixa' | 'media' | 'alta'>('media');
  const [dataInicio, setDataInicio] = useState(dataInicial || new Date().toLocaleDateString('pt-BR'));
  const [dataFim, setDataFim] = useState("");

  const contextosConfig = {
    estudos: { icon: BookOpen, label: 'Estudos', color: 'purple' },
    exercicios: { icon: Dumbbell, label: 'Exercícios', color: 'orange' },
    trabalho: { icon: Briefcase, label: 'Trabalho', color: 'blue' },
    financas: { icon: DollarSign, label: 'Finanças', color: 'green' },
    saude: { icon: Heart, label: 'Saúde', color: 'red' },
    lazer: { icon: Smile, label: 'Lazer', color: 'pink' },
    outros: { icon: MoreHorizontal, label: 'Outros', color: 'gray' }
  };

  const handleConfirm = () => {
    if (!titulo.trim()) {
      alert("Por favor, preencha o título da meta.");
      return;
    }

    onConfirm({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      tipo,
      contexto,
      importancia,
      data_inicio: dataInicio,
      data_fim: dataFim || dataInicio
    });

    // Limpar campos
    setTitulo("");
    setDescricao("");
    setContexto('outros');
    setImportancia('media');
    setDataInicio(dataInicial || new Date().toLocaleDateString('pt-BR'));
    setDataFim("");
  };

  const handleClose = () => {
    setTitulo("");
    setDescricao("");
    setContexto('outros');
    setImportancia('media');
    setDataInicio(dataInicial || new Date().toLocaleDateString('pt-BR'));
    setDataFim("");
    onClose();
  };

  const getTipoLabel = () => {
    switch (tipo) {
      case 'diaria': return 'Diária';
      case 'mensal': return 'Mensal';
      case 'anual': return 'Anual';
    }
  };

  const getColorValue = (color: string) => {
    const colors: Record<string, string> = {
      purple: '#9333ea',
      orange: '#f97316',
      blue: '#3b82f6',
      green: '#10b981',
      red: '#ef4444',
      pink: '#ec4899',
      gray: '#6b7280'
    };
    return colors[color] || colors.gray;
  };

  const getColorBg = (color: string) => {
    const colors: Record<string, string> = {
      purple: '#faf5ff',
      orange: '#fff7ed',
      blue: '#eff6ff',
      green: '#f0fdf4',
      red: '#fef2f2',
      pink: '#fdf2f8',
      gray: '#f9fafb'
    };
    return colors[color] || colors.gray;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Nova Meta {getTipoLabel()}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-3">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Título da Meta *
            </label>
            <Input
              placeholder="Ex: Completar projeto X"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição
            </label>
            <textarea
              placeholder="Descreva sua meta em detalhes..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-primary/40 focus:outline-none min-h-[100px] resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Contexto *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(contextosConfig).map(([key, config]) => {
                const Icon = config.icon;
                const isSelected = contexto === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setContexto(key as ContextoMeta)}
                    className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                      isSelected
                        ? `border-${config.color}-500 bg-${config.color}-50 dark:bg-${config.color}-950/30`
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                    }`}
                    style={isSelected ? {
                      borderColor: getColorValue(config.color),
                      backgroundColor: getColorBg(config.color)
                    } : {}}
                  >
                    <Icon className={`h-5 w-5 ${isSelected ? `text-${config.color}-600` : 'text-gray-500'}`} 
                      style={isSelected ? { color: getColorValue(config.color) } : {}} />
                    <span className="text-xs font-medium">{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Prioridade *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setImportancia('baixa')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  importancia === 'baixa'
                    ? 'border-gray-500 bg-gray-100 dark:bg-gray-900/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-sm font-medium">Baixa</span>
              </button>
              <button
                type="button"
                onClick={() => setImportancia('media')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  importancia === 'media'
                    ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-sm font-medium">Média</span>
              </button>
              <button
                type="button"
                onClick={() => setImportancia('alta')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  importancia === 'alta'
                    ? 'border-rose-500 bg-rose-100 dark:bg-rose-900/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-sm font-medium">Alta</span>
              </button>
            </div>
          </div>

          {tipo !== 'diaria' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data Início
                </label>
                <Input
                  type="text"
                  placeholder="DD/MM/AAAA"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data Fim
                </label>
                <Input
                  type="text"
                  placeholder="DD/MM/AAAA"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              💡 Dica: Após criar a meta, você poderá adicionar tarefas específicas para alcançá-la!
            </p>
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
          >
            Criar Meta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
