import { useState } from 'react';
import { ResumoEstudo } from '@/features/pastas/models/PastaModel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { EditorResumo } from './EditorResumo';
import { Plus, BookOpen, Trash2, Edit2, Check, X, Calendar } from 'lucide-react';

interface VisualizadorResumosProps {
  resumos: ResumoEstudo[];
  onCriarResumo: (titulo: string) => ResumoEstudo;
  onAtualizarResumo: (resumoId: string, dados: Partial<ResumoEstudo>) => void;
  onExcluirResumo: (resumoId: string) => void;
}

export const VisualizadorResumos = ({
  resumos,
  onCriarResumo,
  onAtualizarResumo,
  onExcluirResumo
}: VisualizadorResumosProps) => {
  const [resumoSelecionado, setResumoSelecionado] = useState<string | null>(null);
  const [criandoResumo, setCriandoResumo] = useState(false);
  const [tituloResumo, setTituloResumo] = useState('');
  const [conteudoResumo, setConteudoResumo] = useState('');
  const [editandoTitulo, setEditandoTitulo] = useState<string | null>(null);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [modoEdicao, setModoEdicao] = useState(false);

  const handleSalvarNovoResumo = () => {
    if (tituloResumo.trim()) {
      const resumoCriado = onCriarResumo(tituloResumo.trim());
      // Atualiza o conteúdo do resumo recém-criado
      if (conteudoResumo) {
        onAtualizarResumo(resumoCriado.id, { conteudo: conteudoResumo });
      }
      setTituloResumo('');
      setConteudoResumo('');
      setCriandoResumo(false);
    }
  };

  const handleCancelarNovoResumo = () => {
    setTituloResumo('');
    setConteudoResumo('');
    setCriandoResumo(false);
  };

  const handleSalvarTitulo = (resumoId: string) => {
    if (novoTitulo.trim()) {
      onAtualizarResumo(resumoId, { titulo: novoTitulo.trim() });
    }
    setEditandoTitulo(null);
  };

  const resumoAtual = resumos.find(r => r.id === resumoSelecionado);

  // Visualização sem resumo selecionado - lista de resumos
  if (!resumoSelecionado && !criandoResumo) {
    return (
      <div className="space-y-4">
        {/* Botão criar novo resumo */}
        <Button
          onClick={() => setCriandoResumo(true)}
          className="w-full sm:w-auto gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Resumo</span>
        </Button>

        {/* Lista de resumos */}
        {resumos.length === 0 ? (
          <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Nenhum resumo criado
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Clique em "Novo Resumo" para começar a criar seus resumos de estudo
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumos.map((resumo) => (
              <Card
                key={resumo.id}
                className="p-4 hover:shadow-lg transition-all cursor-pointer group relative bg-white dark:bg-gray-900 border-2 hover:border-cyan-300 dark:hover:border-cyan-700"
                onClick={() => setResumoSelecionado(resumo.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {resumo.titulo}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(resumo.atualizadoEm).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onExcluirResumo(resumo.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                
                {/* Preview do conteúdo */}
                <div 
                  className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 break-words overflow-hidden"
                  dangerouslySetInnerHTML={{ 
                    __html: resumo.conteudo || '<p class="italic text-gray-400">Sem conteúdo ainda...</p>' 
                  }}
                />
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Criando novo resumo - editor completo
  if (criandoResumo) {
    return (
      <div className="space-y-4">
        {/* Botão cancelar */}
        <Button
          onClick={handleCancelarNovoResumo}
          variant="ghost"
          className="gap-2"
        >
          <X className="h-4 w-4" />
          <span>Cancelar</span>
        </Button>

        {/* Card do editor */}
        <Card className="p-6">
          {/* Campo de título */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              <Input
                value={tituloResumo}
                onChange={(e) => setTituloResumo(e.target.value)}
                placeholder="Digite o título do resumo..."
                className="text-2xl font-bold border-2 border-cyan-300 dark:border-cyan-700"
                autoFocus
              />
            </div>
          </div>

          {/* Editor */}
          <EditorResumo
            conteudo={conteudoResumo}
            onChange={(novoConteudo) => setConteudoResumo(novoConteudo)}
          />

          {/* Botão salvar */}
          <div className="mt-6 flex gap-2 justify-end">
            <Button
              onClick={handleCancelarNovoResumo}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSalvarNovoResumo}
              disabled={!tituloResumo.trim()}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
            >
              Salvar Resumo
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Visualização com resumo selecionado - editor
  if (!resumoAtual) {
    return <div>Resumo não encontrado</div>;
  }

  return (
    <div className="space-y-4">
      {/* Botão voltar */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => {
            setResumoSelecionado(null);
            setModoEdicao(false);
          }}
          variant="ghost"
          className="gap-2"
        >
          <X className="h-4 w-4" />
          <span>Voltar para lista</span>
        </Button>

        {/* Botão Editar/Concluir Edição */}
        {!modoEdicao ? (
          <Button
            onClick={() => setModoEdicao(true)}
            className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
          >
            <Edit2 className="h-4 w-4" />
            <span>Editar</span>
          </Button>
        ) : (
          <Button
            onClick={() => setModoEdicao(false)}
            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="h-4 w-4" />
            <span>Concluir Edição</span>
          </Button>
        )}
      </div>

      {/* Card do editor */}
      <Card className="p-6">
        {/* Título editável */}
        <div className="mb-6">
          {editandoTitulo === resumoAtual.id ? (
            <div className="flex items-center gap-2">
              <Input
                value={novoTitulo}
                onChange={(e) => setNovoTitulo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSalvarTitulo(resumoAtual.id);
                  if (e.key === 'Escape') setEditandoTitulo(null);
                }}
                className="text-2xl font-bold border-2 border-cyan-300 dark:border-cyan-700"
                autoFocus
              />
              <Button
                onClick={() => handleSalvarTitulo(resumoAtual.id)}
                size="icon"
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setEditandoTitulo(null)}
                size="icon"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 group">
              <BookOpen className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {resumoAtual.titulo}
              </h2>
              {modoEdicao && (
                <Button
                  onClick={() => {
                    setEditandoTitulo(resumoAtual.id);
                    setNovoTitulo(resumoAtual.titulo);
                  }}
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Última edição: {new Date(resumoAtual.atualizadoEm).toLocaleString('pt-BR')}
          </p>
        </div>

        {/* Conteúdo do Resumo - Modo Visualização ou Edição */}
        {modoEdicao ? (
          <EditorResumo
            conteudo={resumoAtual.conteudo}
            onChange={(novoConteudo) => onAtualizarResumo(resumoAtual.id, { conteudo: novoConteudo })}
          />
        ) : (
          <div 
            className="prose dark:prose-invert max-w-none p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[300px] break-words overflow-x-hidden"
            style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
            dangerouslySetInnerHTML={{ 
              __html: resumoAtual.conteudo || '<p class="text-gray-400 italic">Nenhum conteúdo adicionado ainda...</p>' 
            }}
          />
        )}
      </Card>
    </div>
  );
};
