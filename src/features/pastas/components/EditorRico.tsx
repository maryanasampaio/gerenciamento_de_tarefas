import { useState, useRef, useEffect, useCallback } from 'react';
import { BlocoConteudo } from '@/features/pastas/models/PastaModel';
import { Button } from '@/components/ui/button';
import { EditorResumo } from './EditorResumo';
import {
  Type,
  Heading1,
  List,
  CheckSquare,
  Code,
  Quote,
  Trash2,
  Plus,
  GripVertical,
  Check,
  BookOpen
} from 'lucide-react';

interface EditorRicoProps {
  blocos: BlocoConteudo[];
  onAdicionarBloco: (bloco: Omit<BlocoConteudo, 'id' | 'ordem'>) => void;
  onInserirBlocoApos?: (blocoAnteriorId: string, bloco: Omit<BlocoConteudo, 'id' | 'ordem'>) => string;
  onAtualizarBloco: (blocoId: string, dados: Partial<BlocoConteudo>) => void;
  onRemoverBloco: (blocoId: string) => void;
}

const TIPOS_BLOCOS = [
  { tipo: 'texto' as const, icone: Type, label: 'Texto', descricao: 'Parágrafo simples' },
  { tipo: 'titulo' as const, icone: Heading1, label: 'Título', descricao: 'Título grande' },
  { tipo: 'resumo' as const, icone: BookOpen, label: 'Resumo', descricao: 'Editor rico para resumos' },
  { tipo: 'lista' as const, icone: List, label: 'Lista', descricao: 'Lista com marcadores' },
  { tipo: 'checklist' as const, icone: CheckSquare, label: 'Checklist', descricao: 'Lista com checkbox' },
  { tipo: 'codigo' as const, icone: Code, label: 'Código', descricao: 'Bloco de código' },
  { tipo: 'citacao' as const, icone: Quote, label: 'Citação', descricao: 'Texto em destaque' }
];

export const EditorRico = ({
  blocos,
  onAdicionarBloco,
  onInserirBlocoApos,
  onAtualizarBloco,
  onRemoverBloco
}: EditorRicoProps) => {
  const primeiroTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [blocoParaFocar, setBlocoParaFocar] = useState<string | null>(null);
  const blocosRefs = useRef<Record<string, HTMLTextAreaElement | HTMLInputElement | null>>({});
  // Menu "/" inline — aparece quando digita "/" num bloco vazio
  const [slashMenu, setSlashMenu] = useState<{ blocoId: string; filtro: string } | null>(null);
  // Menu "+" por bloco — aparece ao clicar no + do hover
  const [plusMenu, setPlusMenu] = useState<string | null>(null);

  // Focar no primeiro textarea de texto quando a pasta abre
  useEffect(() => {
    if (blocos.length === 1 && blocos[0].tipo === 'texto' && blocos[0].conteudo === '') {
      primeiroTextareaRef.current?.focus();
    }
  }, [blocos.length]);

  // Focar no bloco recém-criado
  useEffect(() => {
    if (blocoParaFocar) {
      const timer = setTimeout(() => {
        const el = blocosRefs.current[blocoParaFocar];
        if (el) {
          el.focus();
          if ('setSelectionRange' in el) {
            el.setSelectionRange(0, 0);
          }
        }
        setBlocoParaFocar(null);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [blocoParaFocar, blocos]);

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClick = () => {
      setSlashMenu(null);
      setPlusMenu(null);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Handler global de Ctrl+A para selecionar todo o conteúdo
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Detectar Ctrl+A
      if (e.key === 'a' && e.ctrlKey && !e.shiftKey && !e.altKey) {
        const activeElement = document.activeElement;
        
        // Verificar se o foco está em um dos nossos textareas/inputs
        const isOurInput = Object.values(blocosRefs.current).some(el => el === activeElement);
        
        if (isOurInput && (activeElement instanceof HTMLTextAreaElement || activeElement instanceof HTMLInputElement)) {
          // Se há mais de um bloco, sempre selecionar tudo
          if (blocos.length > 1) {
            e.preventDefault();
            e.stopPropagation();
            
            // Construir todo o texto concatenado
            const textoCompleto = blocos.map(b => b.conteudo).join('\n');
            
            // Criar um textarea temporário invisível com todo o conteúdo
            const tempTextarea = document.createElement('textarea');
            tempTextarea.value = textoCompleto;
            tempTextarea.style.position = 'fixed';
            tempTextarea.style.opacity = '0';
            tempTextarea.style.pointerEvents = 'none';
            tempTextarea.style.left = '-9999px';
            document.body.appendChild(tempTextarea);
            
            // Focar e selecionar todo o texto
            tempTextarea.focus();
            tempTextarea.select();
            
            // Adicionar um data attribute para identificar seleção global
            tempTextarea.setAttribute('data-global-selection', 'true');
            
            // Manter referência para operações de delete/backspace
            (window as any).__tempSelectionTextarea = tempTextarea;
            
            // Remover após um delay para permitir eventos de copiar/cortar/deletar
            setTimeout(() => {
              if (document.body.contains(tempTextarea)) {
                // Retornar foco ao bloco original
                if (activeElement instanceof HTMLElement) {
                  activeElement.focus();
                }
                document.body.removeChild(tempTextarea);
                delete (window as any).__tempSelectionTextarea;
              }
            }, 500);
          }
        }
      }
      
      // Detectar Delete/Backspace quando há seleção global
      if ((e.key === 'Delete' || e.key === 'Backspace') && (window as any).__tempSelectionTextarea) {
        const tempTextarea = (window as any).__tempSelectionTextarea;
        if (tempTextarea && document.activeElement === tempTextarea) {
          e.preventDefault();
          
          // Limpar o textarea temporário
          if (document.body.contains(tempTextarea)) {
            document.body.removeChild(tempTextarea);
          }
          delete (window as any).__tempSelectionTextarea;
          
          // Remover todos os blocos exceto o primeiro
          const primeiroBloco = blocos[0];
          if (primeiroBloco) {
            // Limpar conteúdo do primeiro bloco
            onAtualizarBloco(primeiroBloco.id, { conteudo: '' });
            
            // Remover todos os outros blocos
            blocos.slice(1).forEach(bloco => {
              onRemoverBloco(bloco.id);
            });
            
            // Focar no primeiro bloco
            setTimeout(() => {
              const el = blocosRefs.current[primeiroBloco.id];
              if (el) {
                el.focus();
              }
            }, 50);
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown, true);
  }, [blocos, onAtualizarBloco, onRemoverBloco]);

  // Transformar bloco atual em outro tipo (via "/" ou "+")
  const transformarBloco = useCallback((blocoId: string, novoTipo: BlocoConteudo['tipo']) => {
    onAtualizarBloco(blocoId, {
      tipo: novoTipo,
      conteudo: '',
      completado: novoTipo === 'checklist' ? false : undefined
    });
    setSlashMenu(null);
    setPlusMenu(null);
    setBlocoParaFocar(blocoId);
  }, [onAtualizarBloco]);

  // Inserir novo bloco de tipo específico após o bloco atual
  const inserirBlocoTipado = useCallback((blocoAnteriorId: string, tipo: BlocoConteudo['tipo']) => {
    if (onInserirBlocoApos) {
      const novoId = onInserirBlocoApos(blocoAnteriorId, {
        tipo,
        conteudo: '',
        completado: tipo === 'checklist' ? false : undefined
      });
      setBlocoParaFocar(novoId);
    } else {
      onAdicionarBloco({
        tipo,
        conteudo: '',
        completado: tipo === 'checklist' ? false : undefined
      });
    }
    setPlusMenu(null);
  }, [onInserirBlocoApos, onAdicionarBloco]);

  // Handler de teclado
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>, bloco: BlocoConteudo) => {
    // Escape fecha menu
    if (e.key === 'Escape' && slashMenu) {
      e.preventDefault();
      setSlashMenu(null);
      onAtualizarBloco(bloco.id, { conteudo: '' });
      return;
    }

    // Navegar no slash menu com setas
    if (slashMenu && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Tab')) {
      // Deixa o menu lidar — não faz nada aqui
      return;
    }

    // Enter
    if (e.key === 'Enter') {
      // Se o slash menu está aberto, selecionar primeiro item filtrado
      if (slashMenu) {
        e.preventDefault();
        const filtro = slashMenu.filtro.toLowerCase();
        const tipoFiltrado = TIPOS_BLOCOS.find(t =>
          t.label.toLowerCase().includes(filtro) || t.tipo.includes(filtro)
        );
        if (tipoFiltrado) {
          transformarBloco(bloco.id, tipoFiltrado.tipo);
        }
        return;
      }

      // Para bloco de título (input), Enter sempre cria novo bloco de texto
      if (bloco.tipo === 'titulo') {
        e.preventDefault();
        const target = e.target as HTMLInputElement;
        const cursorPos = target.selectionStart ?? target.value.length;
        const conteudoAntes = target.value.slice(0, cursorPos);
        const conteudoDepois = target.value.slice(cursorPos);

        if (conteudoDepois || conteudoAntes !== target.value) {
          onAtualizarBloco(bloco.id, { conteudo: conteudoAntes });
        }

        if (onInserirBlocoApos) {
          const novoId = onInserirBlocoApos(bloco.id, {
            tipo: 'texto',
            conteudo: conteudoDepois
          });
          setBlocoParaFocar(novoId);
        } else {
          onAdicionarBloco({
            tipo: 'texto',
            conteudo: conteudoDepois
          });
        }
        return;
      }

      // Shift+Enter ou Ctrl+Enter: criar novo bloco
      if (e.shiftKey || e.ctrlKey) {
        e.preventDefault();

        const target = e.target as HTMLTextAreaElement | HTMLInputElement;
        const cursorPos = target.selectionStart ?? target.value.length;
        const conteudoAntes = target.value.slice(0, cursorPos);
        const conteudoDepois = target.value.slice(cursorPos);

        if (conteudoDepois || conteudoAntes !== target.value) {
          onAtualizarBloco(bloco.id, { conteudo: conteudoAntes });
        }

        const tipoNovo = (bloco.tipo === 'lista' || bloco.tipo === 'checklist') ? bloco.tipo : 'texto' as const;

        if (onInserirBlocoApos) {
          const novoId = onInserirBlocoApos(bloco.id, {
            tipo: tipoNovo,
            conteudo: conteudoDepois,
            completado: tipoNovo === 'checklist' ? false : undefined
          });
          setBlocoParaFocar(novoId);
        } else {
          onAdicionarBloco({
            tipo: tipoNovo,
            conteudo: conteudoDepois,
            completado: tipoNovo === 'checklist' ? false : undefined
          });
        }
        return;
      }

      // Para listas e checklists, Enter cria novo item
      if (bloco.tipo === 'lista' || bloco.tipo === 'checklist') {
        e.preventDefault();

        const target = e.target as HTMLTextAreaElement | HTMLInputElement;
        const cursorPos = target.selectionStart ?? target.value.length;
        const conteudoAntes = target.value.slice(0, cursorPos);
        const conteudoDepois = target.value.slice(cursorPos);

        if (conteudoDepois || conteudoAntes !== target.value) {
          onAtualizarBloco(bloco.id, { conteudo: conteudoAntes });
        }

        if (onInserirBlocoApos) {
          const novoId = onInserirBlocoApos(bloco.id, {
            tipo: bloco.tipo,
            conteudo: conteudoDepois,
            completado: bloco.tipo === 'checklist' ? false : undefined
          });
          setBlocoParaFocar(novoId);
        } else {
          onAdicionarBloco({
            tipo: bloco.tipo,
            conteudo: conteudoDepois,
            completado: bloco.tipo === 'checklist' ? false : undefined
          });
        }
        return;
      }

      // Para outros tipos (texto, título, código, citação): Enter normal cria quebra de linha
      // Não previne default - deixa o textarea/input fazer seu trabalho natural
    }

    // Backspace: juntar com bloco anterior ou remover bloco vazio
    if (e.key === 'Backspace') {
      const target = e.target as HTMLTextAreaElement | HTMLInputElement;
      const cursorPos = target.selectionStart ?? 0;
      const todoSelecionado = cursorPos === 0 && target.selectionEnd === target.value.length;
      const blocoVazio = target.value === '';
      const cursorNoInicio = cursorPos === 0 && target.selectionEnd === 0;

      // Se cursor está no início de um bloco não-vazio: juntar com anterior
      if (cursorNoInicio && !blocoVazio && blocos.length > 1) {
        e.preventDefault();
        const idx = blocos.findIndex(b => b.id === bloco.id);
        if (idx > 0) {
          const blocoAnterior = blocos[idx - 1];
          const conteudoAnterior = blocoAnterior.conteudo;
          const posicaoCursor = conteudoAnterior.length;
          
          // Juntar conteúdos
          onAtualizarBloco(blocoAnterior.id, { conteudo: conteudoAnterior + target.value });
          
          // Remover bloco atual
          onRemoverBloco(bloco.id);
          
          // Focar no bloco anterior e posicionar cursor
          setTimeout(() => {
            const elemento = blocosRefs.current[blocoAnterior.id];
            if (elemento) {
              elemento.focus();
              if ('setSelectionRange' in elemento) {
                elemento.setSelectionRange(posicaoCursor, posicaoCursor);
              }
            }
          }, 0);
        }
        return;
      }
      
      // Remove o bloco se está vazio OU se todo o texto está selecionado
      if ((blocoVazio || todoSelecionado) && blocos.length > 1) {
        e.preventDefault();
        const idx = blocos.findIndex(b => b.id === bloco.id);
        if (idx > 0) {
          setBlocoParaFocar(blocos[idx - 1].id);
          // Posicionar cursor no final do bloco anterior
          setTimeout(() => {
            const blocoAnterior = blocos[idx - 1];
            const elemento = blocosRefs.current[blocoAnterior.id];
            if (elemento) {
              const tamanho = blocoAnterior.conteudo.length;
              if ('setSelectionRange' in elemento) {
                elemento.setSelectionRange(tamanho, tamanho);
              }
            }
          }, 0);
        }
        onRemoverBloco(bloco.id);
      }
    }

    // Delete em bloco vazio OU com todo conteúdo selecionado: remove e volta para o anterior
    if (e.key === 'Delete') {
      const target = e.target as HTMLTextAreaElement | HTMLInputElement;
      const todoSelecionado = target.selectionStart === 0 && target.selectionEnd === target.value.length;
      const blocoVazio = target.value === '';
      
      // Remove o bloco se está vazio OU se todo o texto está selecionado
      if ((blocoVazio || todoSelecionado) && blocos.length > 1) {
        e.preventDefault();
        const idx = blocos.findIndex(b => b.id === bloco.id);
        if (idx > 0) {
          setBlocoParaFocar(blocos[idx - 1].id);
          // Posicionar cursor no final do bloco anterior
          setTimeout(() => {
            const blocoAnterior = blocos[idx - 1];
            const elemento = blocosRefs.current[blocoAnterior.id];
            if (elemento) {
              const tamanho = blocoAnterior.conteudo.length;
              if ('setSelectionRange' in elemento) {
                elemento.setSelectionRange(tamanho, tamanho);
              }
            }
          }, 0);
        }
        onRemoverBloco(bloco.id);
      }
    }
  }, [blocos, slashMenu, onAtualizarBloco, onInserirBlocoApos, onAdicionarBloco, onRemoverBloco, transformarBloco]);

  // Handler de mudança de texto — detecta "/" para abrir menu
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, bloco: BlocoConteudo) => {
    const valor = e.target.value;
    onAtualizarBloco(bloco.id, { conteudo: valor });

    // Detectar "/" no início do bloco para abrir menu de tipos
    if (valor.startsWith('/')) {
      setSlashMenu({ blocoId: bloco.id, filtro: valor.slice(1) });
    } else if (slashMenu?.blocoId === bloco.id) {
      setSlashMenu(null);
    }

    // Auto-ajusta altura para textareas
    if ('style' in e.target && e.target instanceof HTMLTextAreaElement) {
      e.target.style.height = 'auto';
      e.target.style.height = e.target.scrollHeight + 'px';
    }
  }, [onAtualizarBloco, slashMenu]);

  // Menu "/" flutuante
  const renderSlashMenu = (blocoId: string) => {
    if (!slashMenu || slashMenu.blocoId !== blocoId) return null;
    const filtro = slashMenu.filtro.toLowerCase();
    const tiposFiltrados = TIPOS_BLOCOS.filter(t =>
      t.label.toLowerCase().includes(filtro) ||
      t.tipo.includes(filtro) ||
      t.descricao.toLowerCase().includes(filtro)
    );
    if (tiposFiltrados.length === 0) return null;

    return (
      <div
        className="absolute left-0 top-full z-50 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-1.5 w-64 animate-in fade-in slide-in-from-top-2 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[11px] text-gray-400 px-2 py-1 uppercase tracking-wide font-medium">Tipos de bloco</p>
        {tiposFiltrados.map((tipo) => {
          const Icon = tipo.icone;
          return (
            <button
              key={tipo.tipo}
              className="w-full flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
              onMouseDown={(e) => {
                e.preventDefault();
                transformarBloco(blocoId, tipo.tipo);
              }}
            >
              <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <Icon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{tipo.label}</p>
                <p className="text-xs text-gray-400">{tipo.descricao}</p>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  // Menu "+" flutuante (ao clicar no + do hover de cada bloco)
  const renderPlusMenu = (blocoId: string) => {
    if (plusMenu !== blocoId) return null;

    return (
      <div
        className="absolute left-0 top-full z-50 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-1.5 w-64 animate-in fade-in slide-in-from-top-2 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[11px] text-gray-400 px-2 py-1 uppercase tracking-wide font-medium">Inserir bloco</p>
        {TIPOS_BLOCOS.map((tipo) => {
          const Icon = tipo.icone;
          return (
            <button
              key={tipo.tipo}
              className="w-full flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
              onMouseDown={(e) => {
                e.preventDefault();
                inserirBlocoTipado(blocoId, tipo.tipo);
              }}
            >
              <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <Icon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{tipo.label}</p>
                <p className="text-xs text-gray-400">{tipo.descricao}</p>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  // Controles laterais de cada bloco (hover): + e drag
  const renderControlesLaterais = (bloco: BlocoConteudo) => (
    <div className="absolute -left-14 top-0.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          setPlusMenu(prev => prev === bloco.id ? null : bloco.id);
          setSlashMenu(null);
        }}
        title="Adicionar bloco (ou digite /)"
      >
        <Plus className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
      </button>
      <div className="cursor-grab">
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );

  const renderBloco = (bloco: BlocoConteudo) => {
    switch (bloco.tipo) {
      case 'titulo':
        return (
          <div className="group relative">
            {renderControlesLaterais(bloco)}
            <input
              ref={(el) => { blocosRefs.current[bloco.id] = el; }}
              type="text"
              value={bloco.conteudo}
              onChange={(e) => handleChange(e, bloco)}
              onKeyDown={(e) => handleKeyDown(e, bloco)}
              placeholder=""
              className="w-full text-2xl font-bold bg-transparent border-none outline-none focus:ring-0 px-2 py-1 break-words"
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
            />
            {bloco.conteudo && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemoverBloco(bloco.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
            {renderSlashMenu(bloco.id)}
            {renderPlusMenu(bloco.id)}
          </div>
        );

      case 'texto':
        return (
          <div className="group relative">
            {renderControlesLaterais(bloco)}
            <textarea
              ref={(el) => {
                blocosRefs.current[bloco.id] = el;
                if (blocos[0]?.id === bloco.id) {
                  (primeiroTextareaRef as any).current = el;
                }
              }}
              value={bloco.conteudo}
              onChange={(e) => handleChange(e, bloco)}
              onKeyDown={(e) => handleKeyDown(e, bloco)}
              placeholder=""
              rows={Math.max(bloco.conteudo.split('\n').length, 1)}
              className="w-full bg-transparent border-none outline-none focus:ring-0 px-2 py-1 resize-none overflow-hidden break-words"
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
            />
            {bloco.conteudo && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemoverBloco(bloco.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
            {renderSlashMenu(bloco.id)}
            {renderPlusMenu(bloco.id)}
          </div>
        );

      case 'lista':
        return (
          <div className="group relative">
            {renderControlesLaterais(bloco)}
            <div className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <textarea
                ref={(el) => { blocosRefs.current[bloco.id] = el; }}
                value={bloco.conteudo}
                onChange={(e) => handleChange(e, bloco)}
                onKeyDown={(e) => handleKeyDown(e, bloco)}
                placeholder=""
                rows={Math.max(bloco.conteudo.split('\n').length, 1)}
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 px-2 py-1 resize-none overflow-hidden break-words"
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
              />
            </div>
            {bloco.conteudo && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemoverBloco(bloco.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
            {renderPlusMenu(bloco.id)}
          </div>
        );

      case 'checklist':
        return (
          <div className="group relative">
            {renderControlesLaterais(bloco)}
            <div className="flex items-start gap-2">
              <button
                onClick={() => onAtualizarBloco(bloco.id, { completado: !bloco.completado })}
                className="mt-1 flex-shrink-0"
              >
                {bloco.completado ? (
                  <div className="h-5 w-5 rounded border-2 border-green-500 bg-green-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-green-500 transition-colors" />
                )}
              </button>
              <textarea
                ref={(el) => { blocosRefs.current[bloco.id] = el; }}
                value={bloco.conteudo}
                onChange={(e) => handleChange(e, bloco)}
                onKeyDown={(e) => handleKeyDown(e, bloco)}
                placeholder=""
                rows={Math.max(bloco.conteudo.split('\n').length, 1)}
                className={`flex-1 bg-transparent border-none outline-none focus:ring-0 px-2 py-1 resize-none overflow-hidden break-words ${
                  bloco.completado ? 'line-through text-gray-400' : ''
                }`}
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
              />
            </div>
            {bloco.conteudo && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemoverBloco(bloco.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
            {renderPlusMenu(bloco.id)}
          </div>
        );

      case 'codigo':
        return (
          <div className="group relative">
            {renderControlesLaterais(bloco)}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <textarea
                ref={(el) => { blocosRefs.current[bloco.id] = el; }}
                value={bloco.conteudo}
                onChange={(e) => onAtualizarBloco(bloco.id, { conteudo: e.target.value })}
                placeholder=""
                rows={Math.max(bloco.conteudo.split('\n').length, 3)}
                className="w-full bg-transparent border-none outline-none focus:ring-0 resize-none break-words"
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
              />
            </div>
            {bloco.conteudo && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemoverBloco(bloco.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
            {renderPlusMenu(bloco.id)}
          </div>
        );

      case 'citacao':
        return (
          <div className="group relative">
            {renderControlesLaterais(bloco)}
            <div className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic">
              <textarea
                ref={(el) => { blocosRefs.current[bloco.id] = el; }}
                value={bloco.conteudo}
                onChange={(e) => handleChange(e, bloco)}
                onKeyDown={(e) => handleKeyDown(e, bloco)}
                placeholder=""
                rows={bloco.conteudo.split('\n').length || 1}
                className="w-full bg-transparent border-none outline-none focus:ring-0 resize-none text-gray-600 dark:text-gray-400 break-words"
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
              />
            </div>
            {bloco.conteudo && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemoverBloco(bloco.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
            {renderPlusMenu(bloco.id)}
          </div>
        );

      case 'resumo':
        return (
          <div className="group relative">
            {renderControlesLaterais(bloco)}
            <div className="rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resumo</h3>
              </div>
              <EditorResumo
                conteudo={bloco.conteudo}
                onChange={(novoConteudo) => onAtualizarBloco(bloco.id, { conteudo: novoConteudo })}
              />
            </div>
            {bloco.conteudo && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemoverBloco(bloco.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
            {renderPlusMenu(bloco.id)}
          </div>
        );

      default:
        return null;
    }
  };

  // Clicar na área vazia abaixo dos blocos
  const handleClickAreaVazia = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;

    const ultimoBloco = blocos[blocos.length - 1];
    if (ultimoBloco && ultimoBloco.tipo === 'texto' && ultimoBloco.conteudo === '') {
      blocosRefs.current[ultimoBloco.id]?.focus();
      return;
    }

    if (onInserirBlocoApos && blocos.length > 0) {
      const novoId = onInserirBlocoApos(blocos[blocos.length - 1].id, {
        tipo: 'texto',
        conteudo: ''
      });
      setBlocoParaFocar(novoId);
    } else {
      onAdicionarBloco({ tipo: 'texto', conteudo: '' });
    }
  }, [blocos, onInserirBlocoApos, onAdicionarBloco]);

  return (
    <div
      className="pl-14 pr-4 min-h-[600px] cursor-text"
      onClick={handleClickAreaVazia}
      tabIndex={-1}
    >
      {blocos.map((bloco) => (
        <div key={bloco.id} onClick={(e) => e.stopPropagation()}>
          {renderBloco(bloco)}
        </div>
      ))}
    </div>
  );
};
